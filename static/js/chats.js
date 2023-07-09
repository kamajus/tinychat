const updateRealtimeChat = data => {
  /*
  Update chats position and add new chat

  data: chat content
  */

  let targetUserData = (userData.email === data.messages.to.email)?data.messages.from.email:data.messages.to.email;

  chatEmailFormated = targetUserData.replace('@gmail.com', '')

  let chatExists = false
  chatExists = myFriends.includes(targetUserData)?true:false

  if (chatExists) {
    let chat = document.querySelector(`div#${chatEmailFormated}.message`)
    chat.querySelector('p').textContent = data.messages["content"]
    chat.querySelector('#date').textContent = calculateDateDifference(data.messages["created_at"])

    if (userSelected === data.messages.from.email) {
      fetch("/read_messages", {
        "method": "POST",
        "headers": {
          "Content-Type": "application/json"
        },
        "body": JSON.stringify({
          "users": [data.messages.from.email, data.messages.to.email]
        })
      }) .catch((e) => {
        console.log(e)
      })

    } else if (data.messages.was_readed === false && data.messages.from.email !== userData.email && userSelected !== data.messages.to.email) {
      if (!chat.querySelector('#counter')) {
        let counter = document.createElement('span');
        counter.id = "counter";
        chat.appendChild(counter);
        chat.querySelector('#counter').textContent = "";
      }

      if (data.messages.to.email === userData.email) {
        if (chat.querySelector('#counter').textContent !== "") {
          chat.querySelector('#counter').textContent = parseInt(chat.querySelector('#counter').textContent) + 1;
        } else {
          chat.querySelector('#counter').textContent = 1;
        }
      }
    }

    messageContainer.insertBefore(chat, messageContainer.firstChild)
  } else { messageContainer.insertBefore(createNewChats(data), messageContainer.firstChild) }
}

const createNewChats = chat => {
  /*
  Add new chat

  data: chat content
  */
  let targetUserData = (userData.email === chat.users[0].email)?chat.users[1]:chat.users[0];
  let unreadedChatCount = 0;

  const div = document.createElement("div");
  div.className = "message not_readed";

  if (chat.was_readed) {
    div.className += "message"
  }

  div.id = targetUserData.email.replace("@gmail.com", "");
  div.onclick = messagesClick

  const img = document.createElement("img");
  img.src = targetUserData.photoURL;
  img.id = "user-photo";
  
  const contentDiv = document.createElement("div");
  contentDiv.id = "content";

  const innerDiv = document.createElement("div");

  const userNameSpan = document.createElement("span");
  userNameSpan.id = "user-name";
  userNameSpan.textContent = targetUserData.name;

  const dateSpan = document.createElement("span");
  dateSpan.id = "date";
  dateSpan.textContent = calculateDateDifference(chat.messages["created_at"])
  
  innerDiv.appendChild(userNameSpan);
  innerDiv.appendChild(dateSpan);

  const messageParagraph = document.createElement("p");
  messageParagraph.textContent = chat.messages.content;

  contentDiv.appendChild(innerDiv);
  contentDiv.appendChild(messageParagraph);

  const counterSpan = document.createElement("span");
  counterSpan.id = "counter";

  try {
    for (ct of chat.messages) {
      if (ct.was_readed === false && ct.from !== userData.email) {
        unreadedChatCount += 1;
      }
    }
  } catch {
    unreadedChatCount = 1;
  }

  counterSpan.textContent = unreadedChatCount;
  if (unreadedChatCount !== 0) div.appendChild(counterSpan);
  
  div.appendChild(img);
  div.appendChild(contentDiv);

  return div
}

const updateChats = user => {
  /*
  Fez um requisição para o servidor para ir buscar todos os chats do usuário
  
  user: Objecto user do firebase;
  */
  myFriends = [] // Lista de amigos do usuário logado

  fetch(`/chats/${user.email}`)
  .then(data => data.json())
  .then(chats => {
    chats.forEach(chat => {
      let unreadedChatCount = 0;
      let div = document.createElement("div");

      div.className = "message";
      div.id = chat.user.email.replace("@gmail.com", "");
      div.onclick = messagesClick

      myFriends.push(chat.user.email)

      let img = document.createElement("img");
      img.src = chat.user.photoURL;
      img.id = "user-photo";

      let contentDiv = document.createElement("div");
      contentDiv.id = "content";

      let innerDiv = document.createElement("div");

      let userNameSpan = document.createElement("span");
      userNameSpan.id = "user-name";
      userNameSpan.textContent = chat.user.name;

      let dateSpan = document.createElement("span");
      dateSpan.id = "date";

      dateSpan.textContent = calculateDateDifference(chat.messages[chat.messages.length - 1]["created_at"]);
      
      innerDiv.appendChild(userNameSpan);
      innerDiv.appendChild(dateSpan);

      let messageParagraph = document.createElement("p");
      messageParagraph.textContent = chat.messages[chat.messages.length - 1].content;

      contentDiv.appendChild(innerDiv);
      contentDiv.appendChild(messageParagraph);

      const counterSpan = document.createElement("span");
      counterSpan.id = "counter";

      for (ct of chat.messages) {
        if (ct.was_readed === false && ct.from !== userData.email) {
          unreadedChatCount += 1;
        }
      }

      counterSpan.textContent = unreadedChatCount;

      div.appendChild(img);
      div.appendChild(contentDiv);

      if (unreadedChatCount !== 0) div.appendChild(counterSpan);
      
      messageContainer.appendChild(div);
    })
  })
} 