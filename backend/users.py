#  import json
import random
import string
import requests
from flask import Blueprint, jsonify, session, redirect, request
from flask_cors import CORS

from db import Campaign, Url, User

users_bp = Blueprint('user', __name__, template_folder='templates')
CORS(users_bp)


@users_bp.route('/user/join_campaign/<name>', methods=['GET'])
def join_campaign(name):
    user = session.pop('user')
    camp = Campaign.objects(name=name).first()
    if user.brand:
        raise Exception(f'user: \'{user.username}\' is a brand')
    if not camp:
        raise Exception(f'campaign: \'{name}\' does not exist')
    if name in user.campaigns:
        msg = f'user: \'{user.username}\' is already part of this campaign'
        raise Exception(msg)

    while True:
        url = ''.join(random.SystemRandom().choices(
            string.ascii_uppercase + string.ascii_lowercase + string.digits,
            k=8
        ))
        if not Url.objects(url=url).first():
            break

    Url(url, user.username, camp.name).save()
    full_url = f'/{url}'

    camp.users.append({'username': user.username, 'url': full_url})
    user.campaigns.append(name)
    user.save()
    camp.save()

    return jsonify(**{'successful': True, 'url': full_url})


@users_bp.route('/<refcode>', methods=['GET'])
def run_refcode(refcode):
    url = Url.objects(url=refcode).first()
    if not url:
        raise Exception(f'\'{refcode}\' is not valid')
    camp = Campaign.objects(name=url.campaign_name).first()
    user = User.objects(username=url.username).first()

    if 'clicks' not in camp.stats:
        camp.stats['clicks'] = 0
    camp.stats['clicks'] += 1
    if camp.name not in user.stats:
        user.stats.update({camp.name: {'clicks': 0}})
    user.stats[camp.name]['clicks'] += 1

    print(request.user_agent.platform, request.user_agent.browser)
    platform = request.user_agent.platform
    platform = platform if platform else 'none'
    browser = request.user_agent.browser
    browser = browser if browser else 'none'

    ip = request.access_route[0]
    ip_url = f'https://ipinfo.io/{ip}?token=3e7dac37784e5c'
    ip_data = requests.get(ip_url).json()
    print(ip, ip_url, ip_data)

    for base in [camp.stats, user.stats[camp.name]]:
        for x, y in [('platform', platform), ('browser', browser)]:
            try:
                base[x][y] += 1
            except KeyError as e:
                if e.args[0] == x:
                    base[x] = {y: 1}
                if e.args[0] == y:
                    base[x].update({y: 1})

        if 'location' not in base:
            base['location'] = []
        base['location'].append(ip_data)

    camp.save()
    user.save()
    return redirect(camp.redirect_url)
