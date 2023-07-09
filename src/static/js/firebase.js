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

function updateUserInfo(user) {
    /*
    Atualiza as informações do usuário no user-painel

    user: Objecto user do firebase;
    */
    document.querySelector('.user-painel #user-name').textContent = user.displayName;
    document.querySelector('.user-painel .email').textContent = user.email;
    document.querySelector('.user-painel #user-photo').src = user.photoURL;

    updateChats(user);
}