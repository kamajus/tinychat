const updateRealtimeChat = data => {
  /*
  Atualizando a posição dos chats e adicionando novos chats

  data: conteúdo de um chat
  */

  let targetUserData = (userData.email === data.messages.to.email)?data.messages.from.email:data.messages.to.email;

  chatEmailFormated = targetUserData.replace('@gmail.com', '')
  
  let chatExists = false
  chatExists = myFriends.includes(targetUserData)?true:false

  if (chatExists) {
    document.querySelector(`div#${chatEmailFormated}.message p`).textContent = data.messages["content"]
    document.querySelector(`div#${chatEmailFormated}.message #date`).textContent = calculateDateDifference(data.messages["created_at"])
  } else { messageContainer.insertBefore(createNewChats(data), messageContainer.firstChild) }
}

const createNewChats = chat => {
  /*
  Adiciona um novo chat

  data: conteúdo de um chat
  */
 
  let targetUserData = (userData.email === chat.users[0].email)?chat.users[1]:chat.users[0];

  const div = document.createElement("div");
  div.className = "message";

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
  counterSpan.textContent = "0";

  div.appendChild(counterSpan);

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
  .then(messages => {
    messages.forEach(message => {
      let div = document.createElement("div");

      div.className = "message";
      div.id = message.user.email.replace("@gmail.com", "");
      
      myFriends.push(message.user.email)

      div.onclick = messagesClick

      let img = document.createElement("img");
      img.src = message.user.photoURL;
      img.id = "user-photo";

      let contentDiv = document.createElement("div");
      contentDiv.id = "content";

      let innerDiv = document.createElement("div");

      let userNameSpan = document.createElement("span");
      userNameSpan.id = "user-name";
      userNameSpan.textContent = message.user.name;

      let dateSpan = document.createElement("span");
      dateSpan.id = "date";
      dateSpan.textContent = calculateDateDifference(message.messages["created_at"]);
      
      innerDiv.appendChild(userNameSpan);
      innerDiv.appendChild(dateSpan);

      let messageParagraph = document.createElement("p");
      messageParagraph.textContent = message.messages.content;

      contentDiv.appendChild(innerDiv);
      contentDiv.appendChild(messageParagraph);

      const counterSpan = document.createElement("span");
      counterSpan.id = "counter";
      counterSpan.textContent = message.newMessages;

      div.appendChild(img);
      div.appendChild(contentDiv);

      if (message.newMessages != 0) div.appendChild(counterSpan);
      
      messageContainer.appendChild(div);
    })
  })
} 