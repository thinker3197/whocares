from flask import Flask, jsonify

from db import db, login_manager
from auth import auth


app = Flask(__name__)
app.config.from_object('config')
db.init_app(app)
login_manager.init_app(app)
app.register_blueprint(auth)


@app.route('/', methods=['GET'])
def home():
    return jsonify(**{})


if __name__ == '__main__':
    app.run(debug=True)
