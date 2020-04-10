
        const listSpace = document.querySelector('#eventFind');

        function thisEvent(doc){
            //Make elements
            let eventDiv = document.createElement('div');
            let name = document.createElement('span');
            let date = document.createElement('span');
            let address = document.createElement('span');
            let signup = document.createElement('button');
            signup.setAttribute('id', 'signup');
            signup.innerHTML="Sign up";
            eventDiv.setAttribute('id', 'eventDiv');
            eventDiv.setAttribute('data-id', doc.id);
            //Give spans their content about event
            name.textContent = doc.data().name;
            address.textContent = doc.data().address;
            date.textContent = doc.data().date.toDate();
            //Add spans to div
            eventDiv.appendChild(name);
            eventDiv.appendChild(date);
            eventDiv.appendChild(address);
            // eventDiv.appendChild(signup);
            listSpace.appendChild(eventDiv);
        }
    
        function listEvents() {
            //Access database for events and lists objects.
            db.collection("events").onSnapshot(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    thisEvent(doc);
                })
            })
        }

        function addEvent() {
        }

        document.getElementById('signup').onclick = addEvent;