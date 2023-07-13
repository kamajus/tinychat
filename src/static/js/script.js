// document.querySelector('#messages-action input')
// .addEventListener('input', (e) => {

//   if (e.target.value.trim() !== "") {
//     searchingMessages.style.display = "flex"

//     let users = []

//     for (let user of friends) {
//       if (user.includes(e.target.value)) {
//         let insertIndex = users.findIndex(u => u.length < e.target.value.length);
//         if (insertIndex === -1) {
//           searchingMessages.appendChild(createChat(user))
//         } else {
//           searchingMessages.insertBefore(searchingMessages.firstChild, user)
//         }
//       }
//     }

//     for (let user of users) {
//       createChat({
//         "messages": chatsCached[user]["messages"],
//         "user": chatsCached[user]["user"]
//       })
//     }

//     fetch(`/search/${e.target.value}`)
//     .then((data) => data.json())
//     .then((data) => {
//       for (let dt of data) {
//         if (!friends.includes(dt['email'])) {
//           searchingMessages.appendChild(createChat(dt))
//         }
//       }
//     })
//   } else { searchingMessages.style.display = "none" }
// })
 
document.querySelector('#messages-action form')
.addEventListener('submit', (e) => {
  e.preventDefault();
})

searchBar.querySelector('input')
.addEventListener('focus', (e) => {
  e.target.parentNode.style.borderColor = "#8b6cef"
  searchBar.querySelector('img').src = "/static/img/search-focus.svg"
})

searchBar.querySelector('input')
.addEventListener('blur', (e) => {
  e.target.parentNode.style.borderColor = "rgba(0, 0, 0, 0.50)"
  searchBar.querySelector('img').src = "/static/img/search.svg"
})

const calculateDateDifference = date => {
  let nowDate = moment(new Date().toISOString());
  let endDate = moment(date);

  let duration = moment.duration(nowDate.diff(endDate));

  let timeDuration = {
    "years": duration.years(), "months": duration.months(),
    "days": duration.days(), "hours": duration.hours(),
    "minutes": duration.minutes(), "seconds": duration.seconds()
  }

  let time = 0;

  if (timeDuration.years > 0) {
    time = timeDuration.years+"y";
  } else if (timeDuration.months > 0) {
    time = timeDuration.months+"mo";
  } else if (timeDuration.days > 0) {
    time = timeDuration.days+"d";
  } else if (timeDuration.hours > 0) {
    time = timeDuration.hours+"h";
  } else if (timeDuration.minutes > 0) {
    time = timeDuration.minutes+"m";
  } else if (timeDuration.seconds > 0) {
    time = timeDuration.seconds+"s";
  } else {
    time = "agora"
  }

  return time;
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
    if (anotherPainel.querySelector('mark.email').textContent.replace("#", "") == user) {
      anotherPainel.querySelector('#state').textContent = calculateDateLastStay(lastStay)
    }
  }
}

const updateWriteState = (user, isWriting) => {
  if (anotherPainel.querySelector('mark.email').textContent.replace("#", "") == user) {
    if (isWriting) {
      anotherPainel.querySelector('#state').textContent = "Degitando..."
    } else {
      anotherPainel.querySelector('#state').textContent = "..."
    }
  }
}

const messagesClick = event => {
  /*
  event: Event
  */
  // let selectedElements = document.getElementsByClassName('selected')
  let chat = document.querySelector(`div#${event.target.id}.message`)
  chat.classList.add('selected')

  userSelected = `${event.target.id}@gmail.com`
  messageStudio.innerHTML = ""
  messagesControll.style.display = 'block' 
  
  // if (selectedElements.length > 0) {
  //   for (let element of selectedElements) {
  //     element.classList.remove('selected')
  //   }
  // }

  updateMessages({
    "name": event.target.dataset.name,
    "email": event.target.dataset.email,
    "photoURL": event.target.dataset.photoURL,
    "last_stay": event.target.dataset.last_stay
  }, false)

  if (chat.querySelector('#counter')) {
    fetch("/read_messages", {
      "method": "PUT",
      "headers": {
        "Content-Type": "application/json"
      },
      "body": JSON.stringify({
        "users": [`${event.target.id}@gmail.com`, userData.email]
      })
    })

    chat.querySelector('#counter').remove();
  }
}

userOptions.addEventListener('click', () => {
  miniPopUp.style.display = "flex"
})

window.addEventListener("click", event => {
  if (event.target !== miniPopUp && event.target !== userOptions) {
    miniPopUp.style.display = "none"
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