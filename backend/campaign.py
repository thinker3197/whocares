import json
from flask import Blueprint, jsonify, request, session
from flask_cors import cross_origin

from db import Campaign

campaign_bp = Blueprint('campaign', __name__, template_folder='templates')


@campaign_bp.route('/campaign/all', methods=['GET'])
@cross_origin()
def campaigns_all():
    user = session.pop('user')
    usr = user.username
    if user.brand:
        camps = [x.name for x in Campaign.objects(owner=user.username)]
    else:
        camps = [x.name for x in Campaign.objects()]
    return jsonify(**{'successful': True, 'campaigns': camps, 'user': usr})


@campaign_bp.route('/campaign/active', methods=['GET'])
@cross_origin()
def campaigns_active():
    user = session.pop('user')
    usr = user.username
    if user.brand:
        camps = [x.name for x in Campaign.objects(
            owner=user.username, active=True)]
    else:
        camps = [x.name for x in Campaign.objects(active=True)]
    return jsonify(**{'successful': True, 'campaigns': camps, 'user': usr})


@campaign_bp.route('/campaign/inactive', methods=['GET'])
@cross_origin()
def campaigns_inactive():
    user = session.pop('user')
    usr = user.username
    if user.brand:
        camps = [x.name for x in Campaign.objects(
            owner=user.username, active=False)]
    else:
        camps = [x.name for x in Campaign.objects(active=False)]
    return jsonify(**{'successful': True, 'campaigns': camps, 'user': usr})


@campaign_bp.route('/campaign/name/<name>', methods=['GET'])
@cross_origin()
def campaign_by_name(name):
    camp = Campaign.objects(name=name).first()
    if not camp:
        raise Exception(f'campaign: \'{name}\' does not exist')
    camp_json = json.loads(camp.to_json())
    camp_json.pop('_id')
    return jsonify(**{'successful': True, 'campaign': camp_json})


@campaign_bp.route('/campaign/set_active/<name>', methods=['GET'])
@cross_origin()
def campaign_set_active(name):
    camp = Campaign.objects(name=name).first()
    if not camp:
        raise Exception(f'campaign: \'{name}\' does not exist')
    camp.active = True
    camp.save()
    camp_json = json.loads(camp.to_json())
    camp_json.pop('_id')
    return jsonify(**{'successful': True, 'campaign': camp_json})


@campaign_bp.route('/campaign/set_inactive/<name>', methods=['GET'])
@cross_origin()
def campaign_set_inactive(name):
    camp = Campaign.objects(name=name).first()
    if not camp:
        raise Exception(f'campaign: \'{name}\' does not exist')
    camp.active = False
    camp.save()
    camp_json = json.loads(camp.to_json())
    camp_json.pop('_id')
    return jsonify(**{'successful': True, 'campaign': camp_json})


@campaign_bp.route('/campaign/create', methods=['POST'])
@cross_origin()
def campaign_create():
    user = session.pop('user')
    params = json.loads(request.get_data())
    if Campaign.objects(name=params['name']).first():
        raise Exception(f'campaign: \'{params["name"]}\' already exist')
    if not user.brand:
        raise Exception(f'user: \'{user.username}\' is not a brand')
    if params['type'] not in ['clicks', 'installs', 'views']:
        raise Exception(f'type: \'{params["type"]}\' is not valid')
    campaign = Campaign(params['name'], user.username, params['type'])
    campaign.constraints = params['constraints']
    camp_json = json.loads(campaign.to_json())
    campaign.save()
    return jsonify(**{'successful': True, 'campaign': camp_json})
