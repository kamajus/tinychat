firebase.auth().onAuthStateChanged(function(user) {
    userData = user;
    
    if (!!user && window.document.location.pathname === "/login") {
        window.document.location.pathname = "/";
    } else if (!!!user && window.document.location.pathname === "/") {
        window.document.location.pathname = "/login";
    }

    updateUserInfo(userData)
    userLogin(userData)
});

function updateUserInfo(user) {
    document.querySelector('.user-painel #user-name').textContent = user.displayName;
    document.querySelector('.user-painel .email').textContent = user.email;
    document.querySelector('.user-painel #user-photo').src = user.photoURL;

    updateMessages(user);
}