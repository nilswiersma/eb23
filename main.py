import json
from flask import Flask, render_template, request, redirect, url_for, jsonify

app = Flask(__name__)

@app.route('/')
def index():
    with open('static/schedule.json', 'r') as f:
        schedule = json.load(f)
        print(schedule)
        return render_template('./index.html', schedule=schedule)

if __name__ == '__main__':
    app.run(debug=True, use_reloader=True)