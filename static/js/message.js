const messagesControll = document.querySelector(".messages-controll");
const messageContainer = document.querySelector(".messages");

function updateMessages(userData) {
  fetch(`/chats/${userData.email}`)
  .then(data => data.json())
  .then(message => {
    const div = document.createElement("div");
    div.className = "message";
    div.id = userData.email
    
    div.onclick = messagesClick

    const img = document.createElement("img");
    img.src = message.user.photoURL;
    img.id = "user-photo";

    const contentDiv = document.createElement("div");
    contentDiv.id = "content";

    const innerDiv = document.createElement("div");

    const userNameSpan = document.createElement("span");
    userNameSpan.id = "user-name";
    userNameSpan.textContent = message.user.name;

    const dateSpan = document.createElement("span");
    dateSpan.id = "date";
    dateSpan.textContent = message.time;
    
    innerDiv.appendChild(userNameSpan);
    innerDiv.appendChild(dateSpan);

    const messageParagraph = document.createElement("p");
    messageParagraph.textContent = message.messages.content;

    contentDiv.appendChild(innerDiv);
    contentDiv.appendChild(messageParagraph);

    const counterSpan = document.createElement("span");
    counterSpan.id = "counter";
    counterSpan.textContent = message.newMessages;

    div.appendChild(img);
    div.appendChild(contentDiv);

    if (message.newMessages != 0) {
      div.appendChild(counterSpan);
    }

    messageContainer.appendChild(div);
  })
}