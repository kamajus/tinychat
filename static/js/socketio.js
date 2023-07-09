sio = io('/')

sio.on('pong', (user) => {
    userStates[user.email] = user['last_stay']
    
    if (messagesCached[user.email]) {
        messagesCached[user.email]['last_stay'] = user['last_stay']
        updateUserStates(user.email, user['last_stay'])
    }
})

sio.on('message', data => {
    let targetUserSearch = data.messages.from.email === userData.email?data.messages.to.email:data.messages.from.email
    
    if (data.messages.from.email === userData.email || data.messages.to.email === userData.email) {
        if (userSelected === targetUserSearch) {
            updateMessages(false, {
                "from": data.messages.from.email,
                "to": data.messages.to.email,
                "content": data.messages.content,
                "created_at": data.messages.created_at
            });
        } else {
            fetch(`/search/users/${targetUserSearch}`)
            .then(data => data.json())
            .then(data => {
                updateMessages({
                    "name": data.name,
                    "email": data.email,
                    "photoURL": data.photoURL,
                    "last_stay": calculateDateLastStay(data['last_stay'])
                }, false)
            })
        }
        
        updateRealtimeChat(data)

        if (data.messages.from.email === userData.email && !myFriends.includes(data.messages.to.email)) {
            myFriends.push(data.messages.to.email)
        }
        
        if (data.messages.to.email === userData.email && !myFriends.includes(data.messages.from.email)) {
            myFriends.push(data.messages.from.email)
        }
    }
})

sio.on('typing', message => {
    if (message.to == userData.email) updateWriteState(message.from, true)
    isOtherWriting = true
})

sio.on('un-typing', message => {
    if (message.to == userData.email) updateWriteState(message.from, false)
    isOtherWriting = false
})

const sendMessage = message => {
    sio.emit('message', {
        "from": message.from,
        "to": message.to,
        "content": message.content
    })
}

const typingMessage = () => {
    sio.emit('typing', {
        "from": userData.email,
        "to": userSelected
    })
}

const unTypingMessage = () => {
    sio.emit('un-typing', {
        "from": userData.email,
        "to": userSelected
    })
}

const onLogin = user => { sio.emit('user-login', {'user': user}) }
const tickPing = () => { if (userData) sio.emit('ping', {'user': userData.email})  }