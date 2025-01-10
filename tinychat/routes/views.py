from flask import Blueprint, render_template

views = Blueprint("views", __name__)


@views.get("/login")
def login():
    return render_template("login.html")


@views.get("/")
def index():
    return render_template("index.html")
