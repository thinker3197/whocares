import json
from flask import Blueprint, jsonify, request
from flask_login import login_user, logout_user
from flask_cors import cross_origin

from db import User


auth_bp = Blueprint('auth', __name__, template_folder='templates')


@auth_bp.route('/auth', methods=['POST'])
@cross_origin()
def auth():
    params = json.loads(request.get_data())
    user = User.objects(username=params['username']).first()
    if not user:
        raise Exception(f'user: \'{params["username"]}\' does not exist')
    if not user.verify_password(params['password']):
        raise Exception(f'wrong password')
    login_user(user)
    user_json = {'username': user.username, 'brand': user.brand}
    return jsonify(**{'successful': True, 'user': user_json})


@auth_bp.route('/register', methods=['POST'])
@cross_origin()
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


@auth_bp.route('/signout', methods=['POST'])
@cross_origin()
def signout():
    params = json.loads(request.get_data())
    user = User.objects(username=params['username']).first()
    if not user:
        raise Exception(f'username: \'{params["username"]}\' does not exist')
    logout_user()
    return jsonify(**{'successful': True})
