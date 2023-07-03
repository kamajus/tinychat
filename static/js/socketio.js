sio = io('/')

sio.on('message', data => {
    let sender;
    if (data['from'] == userData.email) {
        sender = userData.email
    } else {
        sender = otherUser
    }
    
    updateConverses(null,
    {
        "from": sender,
        "content": data['content'],
        "create-at": new Date()
    });
})

sio.on('typing', () => {
    document.querySelector('#another-painel #state').textContent = "Degitando..."
})

function sendMessage(data) {
    sio.emit('message', {
        "from": data["from"],
        "to": data["to"],
        "content": data["content"]
    })
}

function typing() {
    sio.emit('typing', {
        "from": userData.email,
        "to": otherUser
    })
}