#  import json
import random
import string
from flask import Blueprint, jsonify, session, redirect
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

    camp.users.append(user.username)
    user.campaigns.append(name)
    user.save()
    camp.save()

    while True:
        url = ''.join(random.SystemRandom().choices(
            string.ascii_uppercase + string.ascii_lowercase + string.digits,
            k=8
        ))
        if not Url.objects(url=url).first():
            break

    Url(url, user.username, camp.name).save()
    full_url = f'/{url}'
    return jsonify(**{'successful': True, 'url': full_url})


@users_bp.route('/<refcode>', methods=['GET'])
def run_refcode(refcode):
    url = Url.objects(url=refcode).first()
    camp = Campaign.objects(name=url.campaign_name).first()
    user = User.objects(username=url.username).first()

    print(camp.to_json())
    camp.stats['clicks'] += 1
    camp.save()

    if camp.name in user.stats:
        user.stats[camp.name]['clicks'] += 1
    else:
        user.stats.update({camp.name: {'clicks': 1}})
    user.save()
    return redirect(camp.redirect_url)
