from flask import Flask
from routes.index import index

app = Flask(__name__)
app.register_blueprint(index)
app.config.from_pyfile('config.cfg', silent=True)

if __name__ == '__main__':
    app.run()