from flask import Flask, jsonify
from flask_login import login_required
from werkzeug.exceptions import HTTPException
from flask_cors import CORS

from db import db, login_manager
from auth import auth_bp
from campaign import campaign_bp


app = Flask(__name__)
cors = CORS(app)
app.config.from_object('config')
db.init_app(app)
login_manager.init_app(app)
app.register_blueprint(auth_bp)
app.register_blueprint(campaign_bp)


@app.route('/', methods=['GET'])
def home():
    return jsonify(**{})


@app.route('/test', methods=['GET'])
@login_required
def test():
    return jsonify(**{})


@app.errorhandler(Exception)
def handle_error(e):
    c = 500 if not isinstance(e, HTTPException) else e.code
    return jsonify(**{'successful': False, 'status': c, 'error': str(e)}), c


if __name__ == '__main__':
    app.run(debug=True)
