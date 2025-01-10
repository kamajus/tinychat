let messagesCached = {};
let chatsCached = {};
let userStates = {};
let friends = [];

let isWriting = false;
let userSelected, userData;

// Fetch Firebase configuration from the backend /secrets endpoint
let firebaseConfig;

// Definindo as funções globalmente
const userLogin = (user) => {
    fetch('/login', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
        }),
    })
        .then(() => {
            onLogin(user.email);
        })
        .catch((error) => {
            console.error(error);
        });
};

const googleSignIn = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    
    firebase.auth()
        .signInWithPopup(provider)
        .then((res) => {
            userData = res.user;
            userLogin(userData);
        })
        .catch((error) => {
            console.error(error);
        });
};

const logOut = () => {
    firebase.auth().signOut()
        .then(() => {
            window.document.location.pathname = "/login";
        })
        .catch((error) => {
            console.error(error);
        });
};

const deleteAccount = () => {
    if (userData) {
        fetch(`/delete_account/${userData.email}`, {
            method: "DELETE",
        })
            .then(() => {
                firebase.auth().signOut()
                    .then(() => {
                        window.document.location.pathname = "/login";
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            })
            .catch((error) => {
                console.error(error);
            });
    }
};

const updateUserInfo = (user) => {
    /*
    Update user information in the user panel.

    user: Firebase user object;
    */
    userPainel.querySelector('#user-name').textContent = user.displayName;
    userPainel.querySelector('.email').textContent = user.email;
    userPainel.querySelector('#user-photo').src = user.photoURL;

    updateChats(user);
};

// Fetch Firebase configuration
fetch('/secrets')
    .then((response) => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then((data) => {
        firebaseConfig = data.firebaseConfig;

        // Initialize Firebase with the fetched configuration
        firebase.initializeApp(firebaseConfig);

        firebase.auth().onAuthStateChanged((user) => {
            userData = user;

            if (!!user && window.document.location.pathname === "/login") {
                window.document.location.pathname = "/";
            } else if (!!!user && window.document.location.pathname === "/") {
                window.document.location.pathname = "/login";
            }

            updateUserInfo(user);
            userLogin(user);
        });

    })
    .catch((error) => {
        console.error('Failed to fetch Firebase configuration:', error);
    });
