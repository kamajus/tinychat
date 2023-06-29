const messageList = [
    {
      name: "John Smith",
      content: "Hello, how are you?",
      time: "10:30",
      newMessages: 2,
      photoUrl: "https://example.com/user1.jpg"
    },
    {
      name: "Mary Johnson",
      content: "I'm fine, thank you!",
      time: "11:45",
      newMessages: 0,
      photoUrl: "https://example.com/user2.jpg"
    },
    {
      name: "Carlos Mateus",
      content: "Let's go out tonight?",
      time: "15:20",
      newMessages: 1,
      photoUrl: "https://example.com/user3.jpg"
    },
    {
      name: "Emily Brown",
      content: "Hey, did you watch the game last night?",
      time: "18:15",
      newMessages: 3,
      photoUrl: "https://example.com/user4.jpg"
    },
    {
      name: "David Lee",
      content: "I'll be late for the meeting. Can you cover for me?",
      time: "09:55",
      newMessages: 0,
      photoUrl: "https://example.com/user5.jpg"
    },
    {
      name: "Sophia Johnson",
      content: "Happy birthday! Let's celebrate tonight!",
      time: "20:40",
      newMessages: 1,
      photoUrl: "https://example.com/user6.jpg"
    },
    {
      name: "Alex Rodriguez",
      content: "I have some exciting news to share!",
      time: "14:10",
      newMessages: 0,
      photoUrl: "https://example.com/user7.jpg"
    },
    {
      name: "Olivia Smith",
      content: "How was your weekend?",
      time: "17:20",
      newMessages: 2,
      photoUrl: "https://example.com/user8.jpg"
    },
    {
      name: "William Johnson",
      content: "Let's meet for coffee tomorrow.",
      time: "13:55",
      newMessages: 0,
      photoUrl: "https://example.com/user9.jpg"
    },
    {
      name: "Emma Wilson",
      content: "Have you seen the latest movie?",
      time: "12:30",
      newMessages: 1,
      photoUrl: "https://example.com/user10.jpg"
    }
];
  

const messagesControll = document.querySelector(".messages-controll");
const messageContainer = document.querySelector(".messages");
const messageStudio = document.querySelector("#message-studio");

messageList.forEach((message) => {
  const div = document.createElement("div");
  div.className = "message";

  const img = document.createElement("img");
  img.src = message.photoUrl;
  img.id = "user-photo";

  const contentDiv = document.createElement("div");
  contentDiv.id = "content";

  const innerDiv = document.createElement("div");

  const userNameSpan = document.createElement("span");
  userNameSpan.id = "user-name";
  userNameSpan.textContent = message.name;

  const dateSpan = document.createElement("span");
  dateSpan.id = "date";
  dateSpan.textContent = message.time;
  
  innerDiv.appendChild(userNameSpan);
  innerDiv.appendChild(dateSpan);

  const messageParagraph = document.createElement("p");
  messageParagraph.textContent = message.content;

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
});

const messageText = document.querySelector('#message-writer > textarea');
const messageImage = document.querySelector('#send-message > img');

messageText.addEventListener('input', (event) => {
  if (event.target.value.trim().length === 0) {
    console.log('nada!')
    messageImage.src = "/static/img/without-message.svg";
  } else {
    console.log('alguma coisa!')
    messageImage.src = "/static/img/with-message.svg";
  }
});

const messages = document.querySelectorAll('.message')

// Selecionando mensagens!
messages.forEach(message => {
  message.addEventListener('click', () => {
    messagesControll.style.display = "block"
  })
})

const converse = [
  {
    sender: "me",
    content: "Oi amor! Como foi o seu dia ontem? Estou ansioso para saber tudo o que aconteceu! 😊",
    date: new Date("2023-06-27T12:30:00"),
  },
  {
    sender: "you",
    content: "Oi meu amor! Meu dia ontem foi maravilhoso! Passei o dia com minha família e me lembrei de você o tempo todo. ❤️",
    date: new Date("2023-06-27T14:20:00"),
  },
  {
    sender: "me",
    content: "Sinto tanto a sua falta... Mal posso esperar para te ver novamente! ❤️",
    date: new Date("2023-06-28T10:15:00"),
  },
  {
    sender: "me",
    content: "Eu tem amo ❤️",
    date: new Date("2023-06-28T10:15:00"),
  },
  {
    sender: "you",
    content: "Eu também te amo!!!",
    date: new Date("2023-06-28T10:15:00"),
  }
];

converse.forEach((message) => {
  const messageBox = document.createElement("message-box");

  if (message.sender == "me") {
    messageBox.className = "message-box me"
  } else {
    messageBox.className = "message-box you"
  }

  const messageDate = document.createElement("span");
  messageDate.id = "message-box-date"
  messageDate.textContent = "12:45";

  const messageContent = document.createElement("p");
  messageContent.id = "message-box-content"
  messageContent.textContent = message.content;

  messageBox.appendChild(messageContent)
  messageBox.appendChild(messageDate)

  messageStudio.appendChild(messageBox)
})