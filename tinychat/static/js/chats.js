const reduceText = (message) => (message.length > 25 ? message.slice(0, 24) + "..." : message);

const fetchAndUpdateChatReadStatus = (data) => {
    fetch("/read_messages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ users: [data.messages.from_email.email, data.messages.to_email.email] }),
    }).catch((e) => console.error(e));
};

const updateChatCounter = (chat, unreadCount) => {
    let counter = chat.querySelector('#counter');
    if (!counter) {
        counter = document.createElement('span');
        counter.id = "counter";
        chat.appendChild(counter);
    }
    counter.textContent = unreadCount;
};

const updateRealtimeChat = (data) => {
    const targetUserData = userData.email === data.messages.to_email.email
        ? data.messages.from_email.email
        : data.messages.to_email.email;

    const chatEmailFormatted = targetUserData.replace('@gmail.com', '');
    const chatExists = friends.includes(targetUserData);

    const chatObj = {
        messages: data.messages,
        user: data.users.find((user) => user.email !== userData.email),
        friend: true,
    };

    if (chatExists) {
        const chat = document.querySelector(`div#${chatEmailFormatted}.message`);
        chat.querySelector('p').textContent = reduceText(data.messages[data.messages.length - 1].content);
        chat.querySelector('#date').textContent = calculateDateDifference(data.messages[data.messages.length - 1].created_at);

        if (userSelected === data.messages.from_email.email) {
            fetchAndUpdateChatReadStatus(data);
        } else if (!data.messages[data.messages.length - 1].was_readed && data.messages[data.messages.length - 1].from_email !== userData.email) {
            if (data.messages[data.messages.length - 1].to_email.email === userData.email) {
                const unreadCount = (parseInt(chat.querySelector('#counter')?.textContent || 0) + 1) || 1;
                updateChatCounter(chat, unreadCount);
            }
        }
        messageContainer.insertBefore(chat, messageContainer.firstChild);
    } else {
        messageContainer.insertBefore(createChat(chatObj), messageContainer.firstChild);
    }
};

const createChat = (chat) => {
    const div = document.createElement("div");
    div.className = "message";
    div.id = chat.user.email.replace("@gmail.com", "");
    div.onclick = messagesClick;

    Object.assign(div.dataset, {
        name: chat.user.name,
        email: chat.user.email,
        photoURL: chat.user.photoURL,
        last_stay: chat.user.last_stay,
    });

    const img = document.createElement("img");
    img.src = chat.user.photoURL;
    img.id = "user-photo";

    const contentDiv = document.createElement("div");
    contentDiv.id = "content";

    const innerDiv = document.createElement("div");
    const userNameSpan = document.createElement("span");
    userNameSpan.id = "user-name";
    userNameSpan.textContent = chat.user.name;

    const dateSpan = document.createElement("span");
    dateSpan.id = "date";
    dateSpan.textContent = calculateDateDifference(chat.messages[chat.messages.length - 1].created_at);

    innerDiv.appendChild(userNameSpan);
    innerDiv.appendChild(dateSpan);
    contentDiv.appendChild(innerDiv);

    const messageParagraph = document.createElement("p");
    const unreadCount = chat.messages.filter(ct => !ct.was_readed && ct.from_email !== userData.email).length;

    if (unreadCount > 0) {
        const counterSpan = document.createElement("span");
        counterSpan.id = "counter";
        counterSpan.textContent = unreadCount;
        div.appendChild(counterSpan);
    }

    messageParagraph.textContent = reduceText(chat.messages[chat.messages.length - 1].content);
    contentDiv.appendChild(messageParagraph);

    div.appendChild(img);
    div.appendChild(contentDiv);

    return div;
};

const updateChats = (user) => {
    friends = [];

    fetch(`/chats/${user.email}`)
        .then((response) => response.json())
        .then((chats) => {
            chats.forEach((chat) => {
                const chatDiv = createChat({
                    messages: chat.messages,
                    user: chat.user,
                    friend: true,
                });

                friends.push(chat.user.email);
                chatsCached[chat.user.email] = { user: chat.user, messages: chat.messages };
                messagesCached[chat.user.email] = chat.messages;

                messageContainer.appendChild(chatDiv);
            });
        });
};
