from flask import Flask
from flask_cors import CORS

from routes.index import index
from routes.views import views
from routes.sockets import sockets, sio

import db

app = Flask(__name__)

app.register_blueprint(index)
app.register_blueprint(views)
app.register_blueprint(sockets)
app.config.from_pyfile('config.cfg', silent=True)

cors = CORS(app, resources={r"/*": {"origins": "*"}})
sio.init_app(app)

if __name__ == '__main__':
    sio.run(app)
