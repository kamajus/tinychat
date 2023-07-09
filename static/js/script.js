function calculateDateDifference(date) {
  var nowDate = moment(new Date().toISOString());
  var endDate = moment(date);

  var duration = moment.duration(nowDate.diff(endDate));

  var years = duration.years();
  var months = duration.months();
  var days = duration.days();
  var hours = duration.hours();
  var minutes = duration.minutes();
  var seconds = duration.seconds();

  var timeUnit = "";
  var value = 0;

  if (years > 0) {
    timeUnit = "y";
    value = years;
  } else if (months > 0) {
    timeUnit = "mo";
    value = months;
  } else if (days > 0) {
    timeUnit = "d";
    value = days;
  } else if (hours > 0) {
    timeUnit = "h";
    value = hours;
  } else if (minutes > 0) {
    timeUnit = "m";
    value = minutes;
  } else if (seconds > 0) {
    timeUnit = "s";
    value = seconds;
  } else {
    value = "agora"
  }

  return value + timeUnit;
}

const calculateDateLastStay = date => {
  /*
  Calcula a diferença entre a data de agora e data da última aparição de um certo usuário.
  */
  var nowDate = moment(new Date().toISOString());
  var endDate = moment(date);

  var duration = moment.duration(nowDate.diff(endDate));
  var minutes = duration.minutes();

  if (minutes >= 1) return calculateDateDifference(date)
  else return "online"
}

const updateUserStates = (user, lastStay) => {
  if (!isOtherWriting) {
    if (document.querySelector('#another-painel mark.email').textContent.replace("#", "") == user) {
      document.querySelector(`#another-painel #state`).textContent = calculateDateLastStay(lastStay)
    }
  }
}

const updateWriteState = (user, isWriting) => {
  if (document.querySelector('#another-painel mark.email').textContent.replace("#", "") == user) {
    if (isWriting) {
      document.querySelector(`#another-painel #state`).textContent = "Degitando..."
    } else {
      document.querySelector(`#another-painel #state`).textContent = "..."
    }
  }
}

const messagesClick = event => {
  /*
  Disparado quando uma mensagem for clicada

  event: Event
  */
  userSelected = `${event.target.id}@gmail.com`
  let selectedElements = document.getElementsByClassName('selected')

  if (selectedElements.length > 0) {
    for (let element of selectedElements) {
      element.classList.remove('selected')
    }
  }

  messagesControll.style.display = 'block'   
  console.log('Uma mensagem foi clicada.')

  let chat = document.querySelector(`div#${event.target.id}.message`)
  chat.classList.add('selected')

  if (chat.querySelector('#counter')) {
    chat.querySelector('#counter').remove();
  }
  
  document.querySelector("#message-studio").innerHTML = ""

  fetch("/read_messages", {
    "method": "POST",
    "headers": {
      "Content-Type": "application/json"
    },
    "body": JSON.stringify({
      "users": [`${event.target.id}@gmail.com`, userData.email]
    })
  })  
  .then(() => {
    fetch(`/search/users/${event.target.id}@gmail.com`)
    .then(data => data.json())
    .then(data => {
      updateMessages({
        "name": data.name,
        "email": data.email,
        "photoURL": data.photoURL,
        "last_stay": calculateDateLastStay(data['last_stay'])
      }, false)
    })
  }).catch((e) => {
    console.error(e)
  })
}

newMessage.addEventListener('click', () => { popUp.style.display = 'flex' })

popUpForm.addEventListener('submit', (e) => {
  e.preventDefault();
  dataFetch = fetch(`/search/users/${e.target.elements.email.value}`)
  .then(data => {
    if (data.ok == false) {
      document.querySelector('div#popup > p').textContent = '❌ Nenhum usuário encontrado! Comece a conversar 💬'
      document.querySelector('div#popup .message').style.display = 'none'
      throw new Error('❌ Nenhum usuário encontrado! Comece a conversar 💬')
    }

    return data.json()
  })
  .then(data => {
    document.querySelector('div#popup .message').style.display = 'flex'
    document.querySelector('div#popup .message').id = data.email.replace('@gmail.com', '')
    document.querySelector('div#popup').onclick = messagesClick

    const userPhoto = document.querySelector('div#popup #user-photo');
    const userName = document.querySelector('div#popup #user-name');
    const date = document.querySelector('div#popup #date');
    const messageParagraph = document.querySelector('div#popup #content p');
    const counter = document.querySelector('div#popup #counter');
    
    userPhoto.src = data.photoURL;
    userName.textContent = data.name;
    date.textContent = data.time;
    
    if (data.content == "" || !messageParagraph.textContent) messageParagraph.textContent = "Óla já estou a usar o Open-chat"

    if (data.newMessages != 0 && data.newMessages) counter.textContent = data.newMessages;

    document.querySelector('#popup > p').style.display = 'none'
  })
  .catch(error => {
    console.error('⚠️ Erro durante a requisição:', error);
  });
});

window.addEventListener("click", event => {
  if (event.target !== popUp && event.target !== newMessage && !popUp.contains(event.target)) {
    popUp.style.display = "none";
  }
});

setInterval(() => {
  if (userData) {
    fetch(`/users/states/${userData.email}`)
    .then(data => data.json())
    .then(users => {
      users.forEach(user => {
        userStates[user.user] = user['last_stay']
        updateUserStates([user.user], user['last_stay'])
      })
    })
  }

  tickPing();
}, 3000)