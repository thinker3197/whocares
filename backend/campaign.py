import json
from flask import Blueprint, jsonify, request, session
from flask_cors import CORS

from db import Campaign, User

campaign_bp = Blueprint('campaign', __name__, template_folder='templates')
CORS(campaign_bp)


@campaign_bp.route('/campaign/all', methods=['GET'])
def campaigns_all():
    user = session.pop('user')
    usr = user.username
    if user.brand:
        camps = [x for x in Campaign.objects(owner=user.username)][::-1]
    else:
        camps = [x for x in Campaign.objects()][::-1]
    return jsonify(**{'successful': True, 'campaigns': camps, 'user': usr})


@campaign_bp.route('/campaign/current', methods=['GET'])
def campaigns_current():
    user = session.pop('user')
    usr = user.username
    if user.brand:
        camps = [x for x in Campaign.objects(
            owner=user.username, active=True)][::-1]
    else:
        camps = [x for x in Campaign.objects(name__in=user.campaigns)][::-1]
    return jsonify(**{'successful': True, 'campaigns': camps, 'user': usr})


@campaign_bp.route('/campaign/stats/<name>', methods=['GET'])
def campaigns_stats(name):
    if not Campaign.objects(name=name).first():
        raise Exception(f'campaign: \'{name}\' does not exist')
    users = [{'username': x.username, 'stats': x.stats, 'eth': x.eth}
             for x in User.objects(campaigns__contains=name)][::-1]
    return jsonify(**{'successful': True, 'stats': users})


@campaign_bp.route('/campaign/active', methods=['GET'])
def campaigns_active():
    user = session.pop('user')
    usr = user.username
    if user.brand:
        camps = [x for x in Campaign.objects(
            owner=user.username, active=True)][::-1]
    else:
        camps = [x for x in Campaign.objects(active=True)][::-1]
    return jsonify(**{'successful': True, 'campaigns': camps, 'user': usr})


@campaign_bp.route('/campaign/inactive', methods=['GET'])
def campaigns_inactive():
    user = session.pop('user')
    usr = user.username
    if user.brand:
        camps = [x for x in Campaign.objects(
            owner=user.username, active=False)][::-1]
    else:
        camps = [x for x in Campaign.objects(active=False)][::-1]
    return jsonify(**{'successful': True, 'campaigns': camps, 'user': usr})


@campaign_bp.route('/campaign/name/<name>', methods=['GET'])
def campaign_by_name(name):
    camp = Campaign.objects(name=name).first()
    if not camp:
        raise Exception(f'campaign: \'{name}\' does not exist')
    camp_json = json.loads(camp.to_json())
    camp_json.pop('_id')
    user = session.pop('user')
    if not user.brand:
        return jsonify(**{
            'successful': True, 'campaign': camp_json,
            'user_stats': user.stats})
    return jsonify(**{'successful': True, 'campaign': camp_json})


@campaign_bp.route('/campaign/set_active/<name>', methods=['GET'])
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
    campaign.desc = params['desc']
    campaign.reserve = params['reserve']
    if 'other' in params:
        campaign.other = params['other']
    campaign.redirect_url = params['redirect_url']
    campaign.stats = {'clicks': 0}
    campaign.constraints = params['constraints']
    camp_json = json.loads(campaign.to_json())
    campaign.save()
    return jsonify(**{'successful': True, 'campaign': camp_json})
