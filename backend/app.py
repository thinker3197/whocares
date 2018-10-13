from flask import Flask, jsonify, request, abort, session
from werkzeug.exceptions import HTTPException
from flask_cors import CORS

from db import db, verify
from auth import auth_bp
from campaign import campaign_bp


app = Flask(__name__)
cors = CORS(app)
app.config.from_object('config')
db.init_app(app)
app.register_blueprint(auth_bp)
app.register_blueprint(campaign_bp)


@app.before_request
def before_request():
    if not request.endpoint:
        return
    blacklist = ['home', 'auth.register', 'auth.auth']
    if request.endpoint not in blacklist:
        print(request.endpoint)
        if request.endpoint.split('.')[0] != 'campaign' or \
           request.endpoint == 'campaign.campaign_create':
            if 'access_token' not in request.headers:
                abort(401)
        if 'access_token' in request.headers:
            user = verify(request.headers['access_token'])
            if not user:
                abort(401)
            session['user'] = user


@app.after_request
def after_request(response):
    if 'user' in session:
        session.pop('user')
    return response


@app.route('/', methods=['GET'])
def home():
    return jsonify(**{})


@app.route('/test', methods=['GET'])
def test():
    user = session.pop('user')
    user_json = {'username': user.username, 'brand': user.brand}
    return jsonify(**{'successful': True, 'user': user_json})


@app.errorhandler(Exception)
def handle_error(e):
    c = 500 if not isinstance(e, HTTPException) else e.code
    return jsonify(**{'successful': False, 'status': c, 'error': str(e)}), c


if __name__ == '__main__':
    app.run(debug=True)
