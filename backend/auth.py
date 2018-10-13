import json
from flask import Blueprint, jsonify, request

from db import User


auth = Blueprint('auth', __name__, template_folder='templates')


@auth.route('/auth', methods=['GET'])
def _auth():
    return jsonify(**{})


@auth.route('/register', methods=['POST'])
def register():
    try:
        params = json.loads(request.get_data())
        user = User(params['username'], params['eth'])
        user.brand = True if params['brand'] == 'true' else False
        user.password = params['password']
        user.save()
        user_json = {'username': user.username, 'brand': user.brand}
        return jsonify(**{'successful': True, 'user': user_json})
    except Exception as e:
        return jsonify(**{'successful': False, 'error': str(e)})
