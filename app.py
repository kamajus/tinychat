from dotenv import load_dotenv

load_dotenv() # Load all env variables

from flask import Flask
from flask_cors import CORS

from routes.index import index
from routes.views import views
from routes.sockets import sockets, sio

from dotenv import load_dotenv

app = Flask(__name__)

cors = CORS(app, resources={r"/*": {"origins": "*"}}) # Add cors to application

app.register_blueprint(index)
app.register_blueprint(views)
app.register_blueprint(sockets)

app.config.from_pyfile('config.cfg', silent=True)
sio.init_app(app) # Add socketio to application

if __name__ == '__main__':
    sio.run(app)
