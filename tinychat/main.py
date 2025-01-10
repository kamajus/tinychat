from flask import Flask
from flask_cors import CORS
from routes.index import index
from routes.sockets import sio, sockets
from routes.views import views

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})

app.register_blueprint(index)
app.register_blueprint(views)
app.register_blueprint(sockets)

app.config.from_pyfile("config.cfg", silent=True)
sio.init_app(app)

if __name__ == "__main__":
    sio.run(app)
