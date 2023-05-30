from flask import Flask


server = Flask(__name__)

@server.get('/')
def hello():
    return 'Hello world!'


if __name__ == '__main__':
    server.run()