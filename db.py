from rich.console import Console
from os import getenv
import pymongo

client = pymongo.MongoClient(f"mongodb+srv://{getenv('MONGO_USERNAME')}:{getenv('MONGO_PASSWORD')}@openchat.htdtkbx.mongodb.net/?retryWrites=true&w=majority")
db = client['open-chat']

console = Console()

try:
    client.admin.command('ping')
except Exception as e:
    console.log(f'[bold red]DB DISCONNECTED, {e}[/]')
else:
    console.log('[bold green]DB CONNECTED[/]')
    

    