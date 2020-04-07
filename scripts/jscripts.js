//DATE::03/29
//I have edited and tested my event creation and tagging functions
//I have I made an events collection and made it so that the doc.id 
//stores in the event object along with the creators id.
//I would like to add a proper timestamp to the event obj, will do later.
//am part way finished an rsvp function for adding yourself to an event
//tomorrow ill mod my event stream so its quereyable and build the 
//search/browse page skeleton
//i have been watching firestore tuts and they recommend having parallell
//doubles of docs to allow for quicker access. no normalization
//I was planning on having the "user" docs contain a collection of events
//created by that person to allow for easy access on that users profile


//////////////////////////////////////////////////////////////////////////////////////

//DATE::whenever I wrote it.

//the database pathways have not been set for any of these functions
//we neeed to decide how we want to organize our events and users

//I was thiking we could either:

//1 - have a general event pool in one collection with the 
//creators' userid as property of the event object
//a guests property fould contain an array of "guests"
//containing the guests userids
//another collection would have the profile objects 
//contining their properties
//a sub collection under the prof objs would contain
//clones of events tht user created
//this would aid in displaying that users events
//alternately we could use eventids as prof obj properties
//to reference the event for recall

//2 - only have the events as a sub collection and use a 
//more complicated ref call to access the event info
//calling parallel properties from different docs can be 
//done by using a .forEvery()
//this would save on space

//i was also thinking we should cut down on non essential 
//functions for now until the core of the app is complete
//the due date is in 2 weeks and we also have alot on our 
//plate as is

//hope you guys arent too stir crazy
//lemme know if you find any faults or anything confusing 
//in my code 

// Code to go to login page if user isn't logged in
// window.location.replace("url");


//made this and the following function "writeEvent" to have modular schemas for future development
function setEvent(eventName, eventDate, eventTime, eventAddr, eventTxtBdy) {
    // 
    db.collection("Userid").doc("").set({
            name: eventName,
            date: eventDate,
            time: eventTime,
            address: eventAddr,
            textBody: eventTxtBdy
        })
        .then(function () {
            console.log("Document successfully written!");
        })
        .catch(function (error) {
            console.error("Error writing document: ", error);
        });
}

function writeEvent(eventName, eventDate, eventTime, eventAddr, eventTxtBdy) {
    db.collection("Events").add({
            name: eventName,
            date: eventDate,
            time: eventTime,
            address: eventAddr,
            textBody: eventTxtBdy
        })
        .then(function (docRef) {
            console.log("Document written with ID: ", docRef.id);
        })
        .catch(function (error) {
            console.error("Error adding document: ", error);
        });
}

//addEvent function passes the text field values to firebase database upon "next" button press
function addEvent() {
    document.getElementById('next').addEventListener('click',
        function (e) {
            e.preventDefault();
            let eventName = document.getElementById("eventNameForm").value;
            let eventDate = document.getElementById("eventDateForm").value;
            let eventTime = document.getElementById("eventTimeForm").value;
            let eventAddr = document.getElementById("eventAddressForm").value;
            let eventTxtBdy = document.getElementById("eventTxtBdyForm").value;
            let going = [];
            let tag = [];
            let ddate = eventDate + 'T' + eventTime + ':00Z';
            let date = new Date(ddate);
            let fbDate = new firebase.firestore.Timestamp.fromDate(date);

            //Need to decide how to organize the database ie.(autogenerated id tags via push as opposed to set,
            //need to do more research on tagging procedures and architecture)
            firebase.auth().onAuthStateChanged(function (user) {
                if (user) {
                    const ref = db.collection('events').doc();
                    ref.set({
                            name: eventName,
                            date: fbDate,
                            address: eventAddr,
                            textBody: eventTxtBdy,
                            creatorId: user.uid,
                            going: going,
                            tag: tag
                        })
                        .then(function () {
                            console.log("Document successfully written!");
                        })
                        .catch(function (error) {
                            console.error("Error writing document: ", error);
                        });


                    const uref = db.collection('users').doc(user.uid).collection('userEvents').doc();
                    uref.set({
                            name: eventName,
                            date: fbDate,
                            address: eventAddr,
                            textBody: eventTxtBdy,
                            creatorId: user.uid,
                            going: going,
                            tag: tag
                        })
                        .then(function () {
                            console.log("Document successfully written!");
                        })
                        .catch(function (error) {
                            console.error("Error writing document: ", error);
                        });


                    tagEvent(ref);
                } else {
                    // No user is signed in.
                }


            });
        })

}
addEvent();


//displays event info from database to text on event page
function showEvent(event) {
    db.collection("events").doc(event).onsnapshot(
        function (snap) {
            //id names are placeholders
            document.getElementById("eventNameText").innerHTML = snap.data().name;
            document.getElementById("eventDateText").innerHTML = snap.data().date;
            document.getElementById("eventTimeText").innerHTML = snap.data().time;
            document.getElementById("eventAddrText").innerHTML = snap.data().address;
            document.getElementById("eventTxtBdyText").innerHTML = snap.data().textBody;
        }
    )
}

//takes whitespace separated tags, arrays them and adds them to existing tag array
function tagEvent(event) {
    document.getElementById("tagButt").addEventListener("click",
        function (e) {
            e.preventDefault();
            let userTags = document.getElementById("eventTagForm").value;
            let eventTags;
            db.collection("events").doc(event).get().then(
                (doc) => {
                    if (doc.exists) {
                        eventTags = doc.data().tag;
                        let tagArray = userTags.match(/\w+|\s+|[^\s\w]+/g);
                        for (let i = 0; i < tagArray.length; i++) {
                            if (/\S/.test(tagArray[i])) {
                                eventTags.push(tagArray[i]);
                            }
                        }
                        console.log(eventTags);
                        db.collection('events').doc(event.id).update({
                            tag: eventTags
                        });
                    } else {
                        console.log("no doc");
                    }
                }
            )
        })
}
tagEvent();


//the foollowing three funcs are for the Event Stream. it pulls all events and filters out events
//that dont match the users tags. the sortDisplayEvents func
//generates li elements ana appends spans containing the name 
//time of the event. forEach currently does not have upper limit.


function sortDisplayEvents(doc) {
    const eventList = document.getElementById('eventList');
    let li = document.createElement('li');
    let name = document.createElement('div');
    let time = document.createElament('div');
    let a = document.createElement('a');
    li.setAttribute('data.id', doc.id);
    name.textContent = doc.data().name;
    time.textContent = doc.data().time;
    li.appendChild(name);
    li.appendChild(time);
    eventList.appendChild(li);
}

function pullEventStream() {
    document.getElementById('searchButt').addEventListener('click', function (e) {
        let userTag = document.getElementById('tagField').value;
        db.collection('events').where('tag', 'array-contains-any', userTag)
            .get().then((snapshot) => {
                snapshot.docs.forEach(doc => {
                    sortDisplayEvents(doc);
                })
            })
    })
}



/////////////////////////////////////////////////////////

//rsvp function
function rsvp() {
    document.getElementById('rsvp').addEventListener('click', function (e) {
        e.preventDefault();
        let arr;
        let arr2;
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                db.collection("events").doc(event.id).get().then(
                    (doc) => {
                        if (doc.exists) {
                            arr = doc.data().going;
                            arr.push(user.id);
                            db.collection('event').doc(event.id).update({
                                going: arr
                            })
                        } else {
                            console.log('doc does not exist');
                        }
                    }
                )

                db.collection('users').doc(user.id).get().then(
                    (doc) => {
                        if (doc.exists) {
                            arr2 = doc.data().going;
                            arr2.push(event.id);
                            db.collection('users').doc(user.id).update({
                                going: arr2
                            })
                        } else {
                            console.log('doc does not exist');
                        }
                    }
                )
            } else {
                // No user is signed in.
            }




        });
    })
}
//need to decide what info should be kept for user profile.
function createProfile() {
    document.getElementById('submit').addEventListener('submit', function (e) {
        e.preventDefault();
        let name = getElementById('nameField').value;
        let age = getElementById('ageField').value;
        let bio = getElementById('bioField').value;
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                const ref = db.collection('users').doc(user.id);
                ref.set({
                        name: name,
                        age: age,
                        bio: bio,
                        userid: user.id
                    })
                    .then(function () {
                        console.log("Document successfully written!");
                    })
                    .catch(function (error) {
                        console.error("Error writing document: ", error);
                    });
            } else {
                // No user is signed in.
            }

        })

    })
}

//Return user to login page if not logged in.
// function checkLogin() {
//     console.log("ran0");
//     firebase.auth().inAuthStateChanged(function (user) {
//         console.log("ran1");
//         if (!user) {
//             window.location.replace("login.html");
//             console.log("ran2");
//         };
//     });
// }
// checkLogin();


// //List events.
// function listEvents() {

// }