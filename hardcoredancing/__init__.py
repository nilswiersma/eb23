import json
import logging
import random
from flask import Flask, make_response, render_template, request, redirect, url_for, jsonify
from markupsafe import escape
from werkzeug.middleware.proxy_fix import ProxyFix

app = Flask(__name__, subdomain_matching=True)
app.config['SERVER_NAME'] = 'hardcoredancing.nl'
app.config['PREFERRED_URL_SCHEME'] = 'https'
# nginx terminates TLS and forwards X-Forwarded-{Proto,Host,For}; trust 1 hop.
app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1)

valid_names = ['bas', 'eric', 'nils', 'thomas', 'tom', 'laura', 'rolf', 'martje']
with open('data/schedule.json', 'r') as f:
    schedule = json.load(f)
    valid_bands = list({x['name'] for x in schedule['props']['pageProps']['bands']})

@app.route('/')
@app.route('/<name>')
def index(name=None):
    # app.logger.warning(f'{app.config=}')
    if name and name in valid_names:
        pass
    elif not name:
        name = request.cookies.get('name', None)
        pass
    else:
        return '', 404

    # TODO add file lock
    ratings = {}
    try:
        with open('data/ratings.json', 'r') as f:
            try:
                ratings = json.load(f)
            except json.decoder.JSONDecodeError as e:
                app.logger.warning(e)
    except FileNotFoundError as e:
        app.logger.warning(e)

    reviews = {}
    try:
        with open('data/reviews.json', 'r') as f:
            try:
                reviews = json.load(f)
            except json.decoder.JSONDecodeError as e:
                app.logger.warning(e)
    except FileNotFoundError as e:
        app.logger.warning(e)

    with open('data/schedule.json', 'r') as f:
        schedule = json.load(f)

    for band in schedule['props']['pageProps']['bands']:
        try:
            band['rating'] = ''.join(ratings[band['name']].values())
        except KeyError as e:
            pass

        try:
            band['review'] = reviews[band['name']]
        except KeyError as e:
            pass

    resp = make_response(render_template('./index.html', schedule=schedule))
    if name:
        resp.set_cookie('name', name)
    return resp

@app.route('/rate', methods=["POST"])
def rate():
    rating = request.get_json()

    if rating['person'] not in valid_names:
        return 'nok'
    if rating['band'] not in valid_bands:
        return 'nok'
    if rating['rating'] == None:
        return 'nok'

    # TODO add file lock
    ratings = {}
    try:
        with open('data/ratings.json', 'r') as f:
            try:
                ratings = json.load(f)
            except json.decoder.JSONDecodeError as e:
                app.logger.warning(e)
    except FileNotFoundError as e:
        app.logger.warning(e)

    try:
        _ = ratings[rating['band']]
    except KeyError:
        ratings[rating['band']] = {}

    try:
        _ = ratings[rating['band']][rating['person']]
    except KeyError:
        ratings[rating['band']][rating['person']] = '💩'

    print(rating)
    print(len(rating['rating']))

    if len(rating['rating']) > 10 or not isinstance(rating['rating'], str):
        del ratings[rating['band']][rating['person']]
    else:
        ratings[rating['band']][rating['person']] = rating['rating']

    with open('data/ratings.json', 'w') as f:
        json.dump(ratings, f, indent=4)
    
    return 'ok'

@app.route('/reviews', methods=["GET", "POST"])
def reviews():
    # TODO add file lock
    reviews = {}
    try:
        with open('data/reviews.json', 'r') as f:
            try:
                reviews = json.load(f)
            except json.decoder.JSONDecodeError as e:
                app.logger.warning(e)
    except FileNotFoundError as e:
        app.logger.warning(e)

    if request.method == 'GET':
        return render_template('./reviews.html', bands=valid_bands, reviews=reviews)
    
    elif request.method == 'POST':
        review = request.get_json()

        if review['band'] not in valid_bands:
            return 'nok'
        
        reviews[review['band']] = review['content']

        with open('data/reviews.json', 'w') as f:
            json.dump(reviews, f, indent=4)

    return 'ok'

@app.route('/ratings')
def ratings():
    ratings = {}
    try:
        with open('data/ratings.json', 'r') as f:
            try:
                ratings = json.load(f)
            except json.decoder.JSONDecodeError as e:
                app.logger.warning(e)
    except FileNotFoundError as e:
        app.logger.warning(e)

    reviews = {}
    try:
        with open('data/reviews.json', 'r') as f:
            try:
                reviews = json.load(f)
            except json.decoder.JSONDecodeError as e:
                app.logger.warning(e)
    except FileNotFoundError as e:
        app.logger.warning(e)

    return render_template('./ratings.html', bands=valid_bands, ratings=ratings, reviews=reviews, reviewers=valid_names)

@app.route('/playlist')
def playlist():
    return render_template('./playlist.html')

@app.route('/', subdomain='agenda')
def agenda(page=None):
    # app.logger.warning('agenda handler')
    return render_template('./agenda.html')

ICAL_URL = 'https://calendar.google.com/calendar/ical/tq51pmqj7phn17n8tnfgbhcgl8%40group.calendar.google.com/private-8ab772bb2048694003989d2279c9ff9f/basic.ics'

@app.route('/agenda.ics', subdomain='agenda')
def agenda_ics():
    import urllib.request
    with urllib.request.urlopen(ICAL_URL, timeout=10) as r:
        body = r.read()
    resp = make_response(body)
    resp.headers['Content-Type'] = 'text/calendar; charset=utf-8'
    resp.headers['Cache-Control'] = 'public, max-age=60'
    return resp

# Process-lifetime cache so repeat lookups don't hammer DDG. Restarts naturally on deploy.
_event_link_cache = {}

def _ddg_first_result(query):
    if query in _event_link_cache:
        return _event_link_cache[query]
    import urllib.request, urllib.parse, re, html as html_mod
    url = 'https://html.duckduckgo.com/html/?q=' + urllib.parse.quote_plus(query)
    req = urllib.request.Request(url, headers={
        'User-Agent': 'Mozilla/5.0 (compatible; hardcoredancing-agenda/1.0)',
    })
    with urllib.request.urlopen(req, timeout=10) as r:
        body = r.read().decode('utf-8', errors='replace')
    m = re.search(r'<a[^>]*class="result__a"[^>]*href="([^"]*)"[^>]*>(.*?)</a>', body, re.DOTALL)
    if not m:
        result = {'title': None, 'url': None}
    else:
        href = m.group(1)
        title = html_mod.unescape(re.sub(r'<[^>]+>', '', m.group(2))).strip()
        # DDG wraps result URLs as //duckduckgo.com/l/?uddg=<url-encoded-target>&...
        mm = re.search(r'uddg=([^&]+)', href)
        if mm:
            href = urllib.parse.unquote(mm.group(1))
        if href.startswith('//'):
            href = 'https:' + href
        result = {'title': title, 'url': href}
    _event_link_cache[query] = result
    return result

@app.route('/event-link', subdomain='agenda')
def event_link():
    q = request.args.get('q', '').strip()
    if not q:
        return jsonify({'error': 'missing q'}), 400
    try:
        return jsonify(_ddg_first_result(q))
    except Exception as e:
        app.logger.warning(f'event-link lookup failed for {q!r}: {e}')
        return jsonify({'title': None, 'url': None}), 502

@app.route('/stamp', methods=["POST"])
def stamp():
    stamp = request.get_json()

    if not isinstance(stamp['state'], bool):
        return 'nok1'
    if not isinstance(stamp['tile_index'], int):
        return 'nok2'
    if not stamp.get('person', None) or stamp['person'] not in valid_names:
        return 'nok3'
    if not (0 <= stamp['tile_index'] < 25):
        return 'nok4'

    # TODO add file lock
    bingo = {}
    try:
        with open('data/bingo.json', 'r') as f:
            try:
                bingo = json.load(f)
            except json.decoder.JSONDecodeError as e:
                app.logger.warning(e)
    except FileNotFoundError as e:
        app.logger.warning(e)

    _ = bingo[stamp['person']]
    _ = bingo[stamp['person']]['state'][stamp['tile_index']]
    bingo[stamp['person']]['state'][stamp['tile_index']] = stamp['state']

    with open('data/bingo.json', 'w') as f:
        json.dump(bingo, f, indent=4)
    
    return 'ok'


@app.route('/bingo')
# @app.route('/', subdomain='bingo')
def bingo(page=None):
    #TODO add file lock
    bingo = {}
    try:
        with open('data/bingo.json', 'r') as f:
            try:
                bingo = json.load(f)
            except json.decoder.JSONDecodeError as e:
                app.logger.warning(e)
    except FileNotFoundError as e:
        app.logger.warning(e)

    try:
        with open('data/bingo-bands.json', 'r') as f:
            try:
                bingo_bands = json.load(f)
            except json.decoder.JSONDecodeError as e:
                app.logger.warning(e)
    except FileNotFoundError as e:
        app.logger.warning(e)
    
    
    for name in valid_names:
        # generate a new bingo card
        if name not in bingo:
            sample = random.sample(bingo_bands, k=24)
            tiles = sample[:12] + ['yuroblast'] + sample[12:]
            bingo[name] = {
                'bandname': tiles,
                'state': [False] * 25,
            }
            with open('data/bingo.json', 'w') as f:
                json.dump(bingo, f, indent=4)

    name = request.cookies.get('name', None)
    if name not in valid_names:
        return render_template('./bingo.html', bingo=None)
    else:
        return render_template('./bingo.html', bingo=bingo[name])

if __name__ == '__main__':
    app.config["SERVER_NAME"] = "hardcoredancing.nl:8080"
    app.run(debug=True, use_reloader=True)
    # app.run()
