var firebaseConfig = {
    apiKey: "AIzaSyC9TTkmaZ5K32mGOSjniYSqMuLrzju0jts",
    authDomain: "funtivities-e4536.firebaseapp.com",
    databaseURL: "https://funtivities-e4536.firebaseio.com",
    projectId: "funtivities-e4536",
    storageBucket: "funtivities-e4536.appspot.com",
    messagingSenderId: "359469274628",
    appId: "1:359469274628:web:9733175c96f2ab8db98751"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());
var uiConfig = {
    callbacks: {
        signInSuccessWithAuthResult: function (authResult, redirectUrl) {
            // User successfully signed in.
            // Return type determines whether we continue the redirect automatically
            // or whether we leave that to developer to handle.
            var user = authResult.user;
            if (authResult.additionalUserInfo.isNewUser) {
                db.collection("users").doc(user.uid).set({
                        name: user.displayName,
                        email: user.email
                    }).then(function () {
                        console.log("New user added to firestore");
                        window.location.assign("index.html");
                    })
                    .catch(function (error) {
                        console.log("Error adding new user: " + error);
                    });
            } else {
                return true;
            }
            return false;
        },

        uiShown: function () {
            // The widget is rendered.
            // Hide the loader.
            document.getElementById('loader').style.display = 'none';
        }
    },
    // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    signInFlow: 'popup',
    signInSuccessUrl: 'index.html',
    signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        //firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        //firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        //firebase.auth.TwitterAuthProvider.PROVIDER_ID,
        //firebase.auth.GithubAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        //firebase.auth.PhoneAuthProvider.PROVIDER_ID
    ],
    // Terms of service url.
    tosUrl: 'index.html',
    // Privacy policy url.
    privacyPolicyUrl: 'index.html',
    accountChooserEnabled: false
};
// The start method will wait until the DOM is loaded.
// Inject the login interface into the HTML
ui.start('#firebaseui-auth-container', uiConfig);