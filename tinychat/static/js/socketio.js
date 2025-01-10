sio = io('/')

sio.on('pong', (user) => {
    userStates[user.email] = user['last_stay']
    
    if (messagesCached[user.email]) {
        messagesCached[user.email]['last_stay'] = user['last_stay']
        updateUserStates(user.email, user['last_stay'])
    }
})

sio.on('message', data => {    
    if (data.messages.from_email.email === userData.email || data.messages.to_email.email === userData.email) {
        updateRealtimeChat(data)

        if (data.messages.from_email.email === userData.email) {
            if (!messagesCached[data.messages.to_email.email]) {
                messagesCached[data.messages.to_email.email] = []
            }
            
            messagesCached[data.messages.to_email.email].push(data.messages)
            if (!friends.includes(data.messages.to_email.email)) friends.push(data.messages.to_email.email)
        } 
        
        if (data.messages.to_email.email === userData.email) {
            if (!messagesCached[data.messages.from_email.email]) {
                messagesCached[data.messages.from_email.email] = []
            }

            messagesCached[data.messages.from_email.email].push(data.messages)
            if (!friends.includes(data.messages.from_email.email)) friends.push(data.messages.from_email.email)
        }

        updateMessages(false, {
            "from_email": data.messages.from_email.email,
            "to_email": data.messages.to_email.email,
            "content": data.messages.content,
            "created_at": data.messages.created_at
        });
    }
})

sio.on('typing', message => {
    if (message.to_email == userData.email) {
        updateWriteState(message.from_email, true)
    }

    isWriting = true
})

sio.on('un-typing', message => {
    if (message.to_email == userData.email) {
        updateWriteState(message.from_email, false)
    }

    isWriting = false
})

const sendMessage = message => {
    sio.emit('message', {
        "from_email": message.from_email,
        "to_email": message.to_email_email,
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