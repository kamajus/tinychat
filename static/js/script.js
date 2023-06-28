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
  

const messageContainer = document.querySelector(".messages");

messageList.forEach((message) => {
  const div = document.createElement("div");
  div.className = "message no-select";

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
