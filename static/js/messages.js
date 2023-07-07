let messageHasContent = false // A mensagem tem conteúdo?
let writingMessageTimer;

messageText.addEventListener('input', (event) => {
  clearTimeout(writingMessageTimer); // Limpando o timer

  if (event.target.value.trim().length === 0) {
    messageHasContent = false
    messageImage.src = "/static/img/without-message.svg";
  } else {
    messageHasContent = true
    messageImage.src = "/static/img/with-message.svg";
  }

  typingMessage(); // O usuário x está escrevendo...

  writingMessageTimer = setTimeout(() => {
    unTypingMessage(); // O usuário x não está escrevendo...
  }, 1000);

});

function createMessages(message) {
  /*
  Adicionando novas mensagens ao chat

  message: conteúdo da mensagem
  */
  const messageBox = document.createElement("message-box");
  
  messageBox.className = (userData.email === message.from)?"message-box me":"message-box you"

  const messageDate = document.createElement("span");
  messageDate.id = "message-box-date"
  messageDate.textContent = calculateDateDifference(message["created_at"]);

  const messageContent = document.createElement("p");
  messageContent.id = "message-box-content"
  messageContent.textContent = message.content;

  messageBox.appendChild(messageContent)
  messageBox.appendChild(messageDate)

  messageStudio.appendChild(messageBox)
}

function updateMessages(data, message) {
  /*
  Atualiza a lista de mensagens de um certo chat

  data: informações do usuário clicado | false
  message: conteúdo da nova mensagem | false
  */
  document.querySelector("#message-studio").innerHTML = ""
  if (data) {
    userSelected = data.email

    let otherEmail = document.createElement("mark")
    otherEmail.textContent = "#"+data.email
    otherEmail.className = "email"

    document.querySelector('#another-painel #user-name').textContent = data.name
    document.querySelector('#another-painel #user-name').appendChild(otherEmail)
    document.querySelector('#another-painel #user-photo').src = data.photoURL
    document.querySelector(`#another-painel #state`).textContent = calculateDateLastStay(userStates[data.email])
    
    if (messagesCached[data["email"]] && !message) {  
      messagesCached[data.email]
      .forEach(messageData => { 
        createMessages(messageData) 
      })

      return
    } else {
      fetch(`/messages`, {
        "method": "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        "body": JSON.stringify({
          "users": [
            userData.email,
            userSelected
          ]
        })
      })
      .then(data => data.json())
      .then(data => {
        messagesCached[userSelected] = data
        messagesCached[userSelected]['last_stay'] = `${data['last_stay']}`
        data.forEach(messageData => { createMessages(messageData) })
      })
    }
  } else if (message) {  
    if (message["from"] == userData.email) {
      if (!messagesCached[message["to"]]) {
        messagesCached[message["to"]] = []
      }
    
      messagesCached[message["to"]].push(message)
      messagesCached[message["to"]].forEach(messageData => { createMessages(messageData) })
    } else {
      if (!messagesCached[message["from"]]) {
        messagesCached[message["from"]] = []
      }

      messagesCached[message["from"]].push(message)
      messagesCached[message["from"]].forEach(messageData => { createMessages(messageData) })
    }
  }
}

sendMessageElement.addEventListener('click', () => {
  if (messageHasContent) {
    sendMessage({
      'from': userData.email,
      'to': userSelected,
      'content': messageText.value
    })
  
    messageText.value = ""
  }
})