let which = 1;

function showUserInfo() {
    document.getElementById('goingEventDiv').style.display = 'none';
    document.getElementById('whichLabel').innerHTML = "Your Events";
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            db.collection('users').doc(user.uid).onSnapshot(
                function (snap) {
                    document.getElementById('profileName').innerHTML = snap.data().name;
                    // document.getElementById('profileAge').innerHTML = snap.data().age;
                    // document.getElementById('profileBody').innerHTML = snap.data().body;
                }
            )
        } else {
            // No user is signed in.
        }
    });


}
showUserInfo();
//calls the id of the tag on the page things will be posted to
const userEventsList = document.querySelector('#userEventDiv');

function makeUserDivs(doc) {
    //makes elements
    let eventDiv = document.createElement('div');
    let name = document.createElement('span');
    let date = document.createElement('span');
    let address = document.createElement('span');
    //sets id: id for css/data.id for event.id
    eventDiv.setAttribute('id', 'eventDiv');
    eventDiv.setAttribute('data-id', doc.id);
    //give spans content
    name.textContent = doc.data().name;
    address.textContent = doc.data().address;
    date.textContent = doc.data().date.toDate();
    //put spans on div
    eventDiv.appendChild(name);
    eventDiv.appendChild(date);
    eventDiv.appendChild(address);
    //put div on page div
    userEventsList.appendChild(eventDiv);
}

function showUserEvents() {
    //accesses db in the sub doc under users called userEvents and for every doc()
    //it calls the above 'makeDivs' that displays them
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            db.collection('users').doc(user.uid)
                .collection('userEvents').get().then((snapshot) => {
                    snapshot.docs.forEach(doc => {
                        makeUserDivs(doc);
                    })
                })
        } else {
            // No user is signed in.
        }
    });


}

//calls the id of the tag on the page things will be posted to
const goingEventsList = document.querySelector('#goingEventDiv');

function makeGoingDivs(doc) {
    //makes elements
    let eventDiv = document.createElement('div');
    let name = document.createElement('span');
    let date = document.createElement('span');
    let address = document.createElement('span');
    //sets id: id for css/data.id for event.id
    eventDiv.setAttribute('id', 'eventDiv');
    eventDiv.setAttribute('data-id', doc.id);
    //
    //give spans content
    name.textContent = doc.data().name;
    address.textContent = doc.data().address;
    date.textContent = doc.data().date.toDate();
    //put spans on div
    eventDiv.appendChild(name);
    eventDiv.appendChild(date);
    eventDiv.appendChild(address);
    //put div on page div
    goingEventsList.appendChild(eventDiv);
}

function showGoingEvents() {
    //accesses db in the sub doc under users called userEvents and for every doc()
    //it calls the above 'makeDivs' that displays them
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            db.collection('users').doc(user.uid)
        .collection('goingEvents').get().then((snapshot) => {
            snapshot.docs.forEach(doc => {
                makeGoingDivs(doc);
            })
        })
        } else {
            // No user is signed in.
        }
    });

    
}

function showButt() {
    document.getElementById('profEventButt').addEventListener('click',
        function (e) {
            e.preventDefault();
            which *= -1;
            show();
        })
}

function show() {
    if (which < 0) {
        document.getElementById('userEventDiv').style.display = 'none';
        document.getElementById('goingEventDiv').style.display = 'block';
        document.getElementById('whichLabel').innerHTML = "RSVP'd Events"
        document.getElementById('profEventButt').innerHTML = "Your Events"
    } else {
        document.getElementById('userEventDiv').style.display = 'block';
        document.getElementById('goingEventDiv').style.display = 'none';
        document.getElementById('whichLabel').innerHTML = "Your Events";
        document.getElementById('profEventButt').innerHTML = "RSVP'd Events"
    }
}
showButt();

showUserEvents();
showGoingEvents();