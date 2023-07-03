let messages;

const popUpForm = document.querySelector('#popup form');
const newMessage = document.querySelector('#new-message')
const popUp = document.querySelector('#popup')

function messagesClick(event) {
  messagesControll.style.display = "block";    
  targetEmail = event.target.id

  fetch(`/search/users/${targetEmail}`)
  .then(data => data.json())
  .then(data => {
    updateConverses({
      "name": data.name,
      "email": data.email,
      "photoURL": data.photoURL
    })
  })
}

newMessage.addEventListener('click', () => {
  popUp.style.display = 'flex'
})

window.addEventListener("click", function(event) {
  if (event.target !== popUp && event.target !== newMessage && !popUp.contains(event.target)) {
    popUp.style.display = "none";
  }
});

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
    document.querySelector('div#popup').onclick = messagesClick

    const userPhoto = document.querySelector('div#popup #user-photo');
    const userName = document.querySelector('div#popup #user-name');
    const date = document.querySelector('div#popup #date');
    const messageParagraph = document.querySelector('div#popup #content p');
    const counter = document.querySelector('div#popup #counter');

    document.querySelector('div#popup .message').id = data.email
    userPhoto.src = data.photoURL;
    userName.textContent = data.name;
    date.textContent = data.time;
    
    if (data.content == "" || !messageParagraph.textContent) {
      messageParagraph.textContent = "Óla já estou a usar o Open-chat"
    }

    if (data.newMessages != 0 && data.newMessages) {
      counter.textContent = data.newMessages;
    }

    document.querySelector('#popup > p').style.display = 'none'
  })
  .catch(error => {
    console.error('⚠️ Erro durante a requisição:', error);
  });
});