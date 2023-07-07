from rich.console import Console
from os import getenv
from dotenv import load_dotenv
import pymongo

load_dotenv()

client = pymongo.MongoClient(f"mongodb+srv://{getenv('MONGO_USERNAME')}:{getenv('MONGO_PASSWORD')}@openchat.htdtkbx.mongodb.net/?retryWrites=true&w=majority")
db = client['open-chat']

console = Console()

try:
    client.admin.command('ping')
except Exception as e:
    console.log(f'[bold red]DB DISCONNECTED, {e}[/]')
else:
    console.log('[bold green]DB CONNECTED[/]')
    

    