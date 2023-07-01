console.log('ok')

sio = io('http://127.0.0.1:5000')

sio.on('message', data => {
    let sender;
    if (data['from'] == userData.email) {
        sender = 'me'
    } else {
        sender = 'you'
    }

    DEFAULT_CONVERSE.push({
        sender: sender,
        content: data['content'],
        date: data['date']
    })

    update_converse();
})

function sendMessage(data) {
    sio.emit('message', {
        "from": data["from"],
        "to": data["to"],
        "content": data["content"]
    })
}
