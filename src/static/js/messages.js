let messageHasContent = false // A mensagem tem conteúdo?
let writingMessageTimer;

messageText.addEventListener('input', (event) => {
  clearTimeout(writingMessageTimer);

  if (event.target.value.trim().length === 0) {
    messageHasContent = false
    messageImage.src = "/static/img/without-message.svg";
  } else {
    messageHasContent = true
    messageImage.src = "/static/img/with-message.svg";
  }

  typingMessage();

  writingMessageTimer = setTimeout(() => {
    unTypingMessage();
  }, 1000);

});

const createMessages = message => {
  /*
  message: conteúdo da mensagem
  */

  const messageBox = document.createElement("message-box");
  const messageDate = document.createElement("span");
  const messageContent = document.createElement("p");
  
  if (message.from_email.email) {
    messageBox.className = (userData.email === message.from_email.email)?"message-box me":"message-box you"
  } else {
    messageBox.className = (userData.email === message.from_email)?"message-box me":"message-box you"
  }

  messageDate.id = "message-box-date"
  messageDate.textContent = calculateDateDifference(message["created_at"]);

  messageContent.id = "message-box-content"
  messageContent.textContent = message.content;

  messageBox.appendChild(messageContent)
  messageBox.appendChild(messageDate)

  messageStudio.appendChild(messageBox)
}

const updateMessages = (data, message) => {
  /*
  data: informações do usuário clicado | false
  message: conteúdo da nova mensagem | false
  */
 
  messageStudio.innerHTML = ""
  
  if (data) {
    let otherEmail = document.createElement("mark")
    
    if (userSelected === data.email) {
      otherEmail.textContent = "#"+data.email
      otherEmail.className = "email"

      anotherPainel.querySelector('#user-name').textContent = data.name
      anotherPainel.querySelector('#user-name').appendChild(otherEmail)

      anotherPainel.querySelector('#user-photo').src = data.photoURL
      anotherPainel.querySelector('#state').textContent = calculateDateLastStay(data.last_stay)
    }

    if (messagesCached[data.email]) messagesCached[data.email].forEach(messageData => { createMessages(messageData) })

  } else if (message && (userSelected == message["from_email"] || userSelected == message["to_email"])) {
    if (message["from_email"] == userData.email) {
      messagesCached[message["to_email"]].forEach(messageData => { createMessages(messageData) })
    } else {
      messagesCached[message["from_email"]].forEach(messageData => { createMessages(messageData) })
    }
  }

  messageStudio.scrollTop = messageStudio.scrollHeight;
}

sendMessageElement.addEventListener('click', () => {
  if (messageHasContent) {
    sendMessage({
      'from_email': userData.email,
      'to_email': userSelected,
      'content': messageText.value
    })
  
    messageHasContent = false
    messageText.value = ""
  }
})