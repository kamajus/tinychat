firebase.auth().onAuthStateChanged(function(user) {
    const isLoggedIn = !!user;
    const isLoginPage = window.document.location.pathname === "/login";

    userData = user;

    console.log(isLoggedIn && isLoginPage)
    if (isLoggedIn && isLoginPage) {
        window.document.location.pathname = "/";
    } else if (!isLoggedIn && !isLoginPage) {
        window.document.location.pathname = "/login";
    }

    updateUserInfo(userData)
    userLogin(userData)
});

function updateUserInfo(user) {
    document.querySelector('.user-painel #user-name').textContent = user.displayName;
    document.querySelector('.user-painel #email').textContent = user.email;
    document.querySelector('.user-painel #user-photo').src = user.photoURL;
}