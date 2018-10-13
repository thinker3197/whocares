import json
from flask import Blueprint, jsonify, request
from flask_login import login_user, logout_user

from db import User


auth = Blueprint('auth', __name__, template_folder='templates')


@auth.route('/auth', methods=['POST'])
def _auth():
    params = json.loads(request.get_data())
    user = User.objects(username=params['username']).first()
    if not user:
        raise Exception(f'username: \'{params["username"]}\' does not exist')
    if not user.verify_password(params['password']):
        raise Exception(f'wrong password')
    login_user(user)
    user_json = {'username': user.username, 'brand': user.brand}
    return jsonify(**{'successful': True, 'user': user_json})


@auth.route('/register', methods=['POST'])
def register():
    params = json.loads(request.get_data())
    if User.objects(username=params['username']).first():
        raise Exception(f'username: \'{params["username"]}\' already exists')
    user = User(params['username'], params['eth'])
    user.brand = True if params['brand'] == 'true' else False
    user.password = params['password']
    user.save()
    user_json = {'username': user.username, 'brand': user.brand}
    return jsonify(**{'successful': True, 'user': user_json})


@auth.route('/signout', methods=['POST'])
def signout():
    params = json.loads(request.get_data())
    user = User.objects(username=params['username']).first()
    if not user:
        raise Exception(f'username: \'{params["username"]}\' does not exist')
    logout_user()
    return jsonify(**{'successful': True})
