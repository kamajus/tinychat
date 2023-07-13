let messagesCached = {};
let chatsCached = {};
let userStates = {};
let friends = [];

let isOtherWriting = false;
let userSelected, userData;

firebase.initializeApp({
    apiKey: "AIzaSyAwLawFqBXpugTFrGZ47Omd1hx7vJQZhqA",
    authDomain: "open-chat-44975.firebaseapp.com",
    projectId: "open-chat-44975",
    storageBucket: "open-chat-44975.appspot.com",
    messagingSenderId: "419750701729",
    appId: "1:419750701729:web:e959b1da9d9534eb869ee0"
});

const provider = new firebase.auth.GoogleAuthProvider();

const userLogin = user =>{
    fetch('/login', {
        "method": "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "name": user["displayName"],
            "email": user["email"],
            "photoURL": user["photoURL"]
        })
    }).then(() => {
        onLogin(user.email)
    }).catch(error => {
        console.error(error)
    })
}

const googleSignIn = () => {
    firebase.auth()
    .signInWithPopup(provider)
    .then((res) => {
        userData = res.user;
        userLogin(userData)
    }).catch((error) => {
        console.error(error)
    });
}

const logOut = () => {
    firebase.auth().signOut().then(() => {
        window.document.location.pathname = "/login"
    }).catch((error) => {
        console.log(error)
    });
}

const deleteAccount = () => {
    if (userData) {
        fetch(`/delete_account/${userData.email}`, {
            "method": "DELETE"
        })
        .then(() => {
            firebase.auth().signOut().then(() => {
                window.document.location.pathname = "/login"
            }).catch((error) => {
                console.log(error)
            });
        }).catch((error) => {
            console.log(error)
        })
    }
}

firebase.auth().onAuthStateChanged(user => {
    userData = user

    if (!!user && window.document.location.pathname === "/login") {
        window.document.location.pathname = "/";
    } else if (!!!user && window.document.location.pathname === "/") {
        window.document.location.pathname = "/login";
    }
    
    updateUserInfo(user)
    userLogin(user)
});

const updateUserInfo = user => {
    /*
    Atualiza as informações do usuário no user-painel

    user: Objecto user do firebase;
    */
    userPainel.querySelector('#user-name').textContent = user.displayName;
    userPainel.querySelector('.email').textContent = user.email;
    userPainel.querySelector('#user-photo').src = user.photoURL;

    updateChats(user);
}
