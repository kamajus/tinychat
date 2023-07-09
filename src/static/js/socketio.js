sio = io('/')

sio.on('pong', (user) => {
    userStates[user.email] = user['last_stay']
    
    if (messagesCached[user.email]) {
        messagesCached[user.email]['last_stay'] = user['last_stay']
        updateUserStates(user.email, user['last_stay'])
    }
})

sio.on('message', data => {
    let targetUserSearch = data.messages.from_email.email === userData.email?data.messages.to_email.email:data.messages.from_email.email
    
    if (data.messages.from_email.email === userData.email || data.messages.to_email.email === userData.email) {
        if (userSelected === targetUserSearch) {
            updateMessages(false, {
                "from_email": data.messages.from_email.email,
                "to_email": data.messages.to_email.email,
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

        if (data.messages.from_email.email === userData.email && !myFriends.includes(data.messages.to_email.email)) {
            myFriends.push(data.messages.to_email.email)
        }
        
        if (data.messages.to_email.email === userData.email && !myFriends.includes(data.messages.from_email.email)) {
            myFriends.push(data.messages.from_email.email)
        }
    }
})

sio.on('typing', message => {
    if (message.to == userData.email) updateWriteState(message.from_email, true)
    isOtherWriting = true
})

sio.on('un-typing', message => {
    if (message.to == userData.email) updateWriteState(message.from_email, false)
    isOtherWriting = false
})

const sendMessage = message => {
    sio.emit('message', {
        "from_email": message.from_email,
        "to_email": message.to_email,
        "content": message.content
    })
}

const typingMessage = () => {
    sio.emit('typing', {
        "from_email": userData.email,
        "to_email": userSelected
    })
}

const unTypingMessage = () => {
    sio.emit('un-typing', {
        "from_email": userData.email,
        "to_email": userSelected
    })
}

const onLogin = user => { sio.emit('user-login', {'user': user}) }
const tickPing = () => { if (userData) sio.emit('ping', {'user': userData.email})  }