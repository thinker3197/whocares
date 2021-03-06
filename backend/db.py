from flask import current_app
from flask_mongoengine import MongoEngine
from itsdangerous import BadSignature
from itsdangerous import JSONWebSignatureSerializer as Serializer
from werkzeug.security import generate_password_hash, check_password_hash


db = MongoEngine()


def verify(token):
    s = Serializer(current_app.config['SECRET_KEY'])
    try:
        data = s.loads(token)
    except BadSignature:
        print('here')
        return None
    if 'verify' not in data:
        return None
    user = User.objects(pk=data['verify']).first()
    if not user:
        return None
    return user


class User(db.Document):
    meta = {'collection': 'users'}
    username = db.StringField()
    eth = db.StringField()
    password_hash = db.StringField()
    brand = db.BooleanField(default=False)
    enable = db.BooleanField(default=True)
    campaigns = db.ListField()
    stats = db.DictField()

    @property
    def password(self):
        raise AttributeError('password is not a readable attribute')

    @password.setter
    def password(self, password):
        self.password_hash = generate_password_hash(password)

    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)

    def generate_confirmation_token(self):
        s = Serializer(current_app.config['SECRET_KEY'])
        return s.dumps({'verify': str(self.id)})


class Campaign(db.Document):
    meta = {'collection': 'campaigns'}
    name = db.StringField()
    owner = db.StringField()
    desc = db.StringField()
    typ = db.StringField()
    reserve = db.StringField()
    redirect_url = db.StringField()
    active = db.BooleanField(default=True)
    constraints = db.DictField()
    other = db.DictField()
    stats = db.DictField()
    users = db.ListField()


class Url(db.Document):
    meta = {'collection': 'urls'}
    url = db.StringField()
    username = db.StringField()
    campaign_name = db.StringField()
