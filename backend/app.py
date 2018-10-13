from flask import Flask, jsonify

from db import db
from auth import auth


app = Flask(__name__)
db.init_app(app)
app.register_blueprint(auth)


@app.route('/', methods=['GET'])
def home():
    return jsonify(**{'status': 'working'})



if __name__ == '__main__':
    app.run(debug=True)
