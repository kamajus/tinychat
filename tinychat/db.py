from os import getenv

import pymongo
from dotenv import load_dotenv
from rich.console import Console

load_dotenv()

client = pymongo.MongoClient(
    f"mongodb+srv://{getenv('MONGO_USERNAME')}:{getenv('MONGO_PASSWORD')
                                                }@{getenv('MONGO_HOST')}/?retryWrites=true&w=majority"
)
db = client["openchat"]

console = Console()

try:
    client.admin.command("ping")
except Exception as e:
    console.log(f"[bold red]DB DISCONNECTED, {e}[/]")
else:
    console.log("[bold green]DB CONNECTED[/]")
