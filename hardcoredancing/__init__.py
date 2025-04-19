import json
import logging
from flask import Flask, make_response, render_template, request, redirect, url_for, jsonify
from markupsafe import escape

app = Flask(__name__, subdomain_matching=True)
app.config["SERVER_NAME"] = "hardcoredancing.nl"

valid_names = ['bas', 'eric', 'nils', 'thomas', 'tom']
with open('data/schedule.json', 'r') as f:
    schedule = json.load(f)
    valid_bands = list({x['name'] for x in schedule['props']['pageProps']['bands']})

@app.route('/')
@app.route('/<name>')
def index(name=None):
    if name and name in valid_names:
        # print(f'{name=}')
        # person = name
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
            band['rating'] = escape(''.join(ratings[band['name']].values()))
        except KeyError as e:
            pass

        try:
            band['review'] = escape(reviews[band['name']])
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

    return render_template('./ratings.html', bands=valid_bands, ratings=ratings)

@app.route('/playlist')
def playlist():
    return render_template('./playlist.html')

#@app.route('/agenda')
@app.route('/<page>', subdomain='agenda')
def agenda(page=None):
    return render_template('./agenda.html')

if __name__ == '__main__':
    app.run(debug=True, use_reloader=True)
    # app.run()
