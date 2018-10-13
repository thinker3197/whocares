from flask_login import UserMixin, LoginManager
from flask_mongoengine import MongoEngine
from werkzeug.security import generate_password_hash, check_password_hash


db = MongoEngine()
login_manager = LoginManager()
login_manager.session_protection = 'strong'


@login_manager.user_loader
def load_user(user_id):
    return User.objects(pk=user_id).first()


class User(UserMixin, db.Document):
    meta = {'collection': 'users'}
    username = db.StringField()
    eth = db.StringField()
    password_hash = db.StringField()
    brand = db.BooleanField(default=False)
    enable = db.BooleanField(default=True)

    @property
    def password(self):
        raise AttributeError('password is not a readable attribute')

    @password.setter
    def password(self, password):
        self.password_hash = generate_password_hash(password)

    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)


class Campaign(UserMixin, db.Document):
    meta = {'collection': 'campaigns'}
    name = db.StringField()
    owner = db.StringField()
    typ = db.StringField()
    constraints = db.DictField()
