const messageStudio = document.querySelector("#message-studio");
const messageText = document.querySelector('#message-writer > textarea');
const messageImage = document.querySelector('#send-message > img');

const sendMessageElement = document.querySelector('#send-message')

let hasContent = false

messageText.addEventListener('input', (event) => {
  if (event.target.value.trim().length === 0) {
    hasContent = false
    messageImage.src = "/static/img/without-message.svg";
  } else {
    hasContent = true
    messageImage.src = "/static/img/with-message.svg";
  }

  typing(); // Chama a função que sinaliza que o usuário está escrevendo uma mensagem!
});

let otherUser;

function createMessage(converse) {
  const messageBox = document.createElement("message-box");
      
  if (userData.email === converse.from) {
    messageBox.className = "message-box me"
  } else {
    messageBox.className = "message-box you"
  }

  const messageDate = document.createElement("span");
  messageDate.id = "message-box-date"
  messageDate.textContent = "12:45";

  const messageContent = document.createElement("p");
  messageContent.id = "message-box-content"
  messageContent.textContent = converse.content;

  messageBox.appendChild(messageContent)
  messageBox.appendChild(messageDate)

  messageStudio.appendChild(messageBox)
}

function updateConverses(data, converse) {
  if (data) {
    let otherEmail = document.createElement("mark")
    
    otherUser = data.email
    otherEmail.textContent = "#"+data.email
    otherEmail.className = "email"
    document.querySelector('#another-painel #user-name').textContent = data.name
    document.querySelector('#another-painel #user-name').appendChild(otherEmail)
    document.querySelector('#another-painel #user-photo').src = data.photoURL

    // Get all messages

    usersData = JSON.stringify({
      "users": [
        userData.email,
        otherUser
      ]
    })

    fetch(`/messages`, {
      "method": "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      "body": usersData
    })
    .then(data => data.json())
    .then(data => {
        data.forEach(messageData => { createMessage(messageData) })
    });
  } else if (converse) {
    createMessage(converse)
  }
}

sendMessageElement.addEventListener('click', () => {
    if (hasContent) {
      sendMessage({
          'from': userData.email,
          'to': otherUser,
          'content': messageText.value
      })
  
      messageText.value = ""
    }
})