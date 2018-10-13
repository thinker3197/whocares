import json
from flask import Blueprint, jsonify, request, session
from flask_cors import cross_origin


from db import User, Campaign

campaign_bp = Blueprint('campaign', __name__, template_folder='templates')


@campaign_bp.route('/campaign', methods=['GET'])
@cross_origin()
def campaigns():
    user = session.pop('user')
    if not user.brand:
        raise Exception(f'user: \'{user.username}\' is not a brand')
    camps = [x.name for x in Campaign.objects(owner=user.username)]
    return jsonify(**{'successful': True, 'campaigns': camps})


@campaign_bp.route('/campaign/all', methods=['GET'])
@cross_origin()
def campaigns_all():
    camps = [x.name for x in Campaign.objects()]
    return jsonify(**{'successful': True, 'campaigns': camps})


@campaign_bp.route('/campaign/name/<name>', methods=['GET'])
@cross_origin()
def campaign_by_name(name):
    camp = Campaign.objects(name=name).first()
    camp_json = json.loads(camp.to_json())
    camp_json.pop('_id')
    return jsonify(**{'successful': True, 'campaign': camp_json})


@campaign_bp.route('/campaign/create', methods=['POST'])
@cross_origin()
def campaign_create():
    constraints = {
        'clicks': ['no_of_clicks'],
        'installs': ['no_of_installs', 'no_of_clicks'],
        'views': ['no_of_views'],
    }
    current_user = session.pop('user')
    params = json.loads(request.get_data())
    user = User.objects(username=params['owner']).first()
    if not user:
        raise Exception(f'user: \'{params["owner"]}\' does not exist')
    if Campaign.objects(name=params['name']).first():
        raise Exception(f'name: \'{params["name"]}\' already exist')
    if not user.brand:
        raise Exception(f'user: \'{params["owner"]}\' is not a brand')
    if user.username != current_user.username:
        raise Exception(f'user: \'{params["owner"]}\' is not logged in')
    if params['type'] not in ['clicks', 'installs', 'views']:
        print('3')
        raise Exception(f'type: \'{params["type"]}\' is not valid')
    campaign = Campaign(params['name'], params['owner'], params['type'])
    campaign.constraints = {x: 0 for x in constraints[params['type']]}
    camp_json = json.loads(campaign.to_json())
    campaign.save()
    return jsonify(**{'successful': True, 'campaign': camp_json})
