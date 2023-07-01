import pymongo

client = pymongo.MongoClient("mongodb+srv://carlosmateus:uQDBbIrjbm1T1DYd@openchat.htdtkbx.mongodb.net/?retryWrites=true&w=majority")
db = client['open-chat']

try:
    client.admin.command('ping')
except Exception as e:
    print('\33[41mFALHA AO CONECTAR-SE AO BD!\33[m')
    print(e)
else:
    print('\33[42mBD CONECTADO COM SUCESSO!\33[m')
    