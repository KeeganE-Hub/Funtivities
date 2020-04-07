let eventDateArr = []
let eventDateSepArr = []
let month_arr = [];

month_arr[0] = "January";
month_arr[1] = "February";
month_arr[2] = "March";
month_arr[3] = "April";
month_arr[4] = "May";
month_arr[5] = "June";
month_arr[6] = "July";
month_arr[7] = "August";
month_arr[8] = "September";
month_arr[9] = "October";
month_arr[10] = "November";
month_arr[11] = "December";

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        readData(user.uid);
    } else {
        document.write("You are not logged in!");
    }
});

function readData(id) {
    db.collection("events").onSnapshot(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            if (id == doc.data().creatorId) {
                let d = doc.data().date.toDate();
                let theYear = d.getFullYear().toString();
                let theMonth = parseInt(d.getMonth() + 1).toString();
                let theMonthIndex = d.getMonth();
                let theDay = d.getDate().toString();

                eventDateSepArr.push({
                    year: theYear,
                    month: theMonth,
                    monthIndex: theMonthIndex,
                    day: theDay
                });

                if (theMonth.toString().length == 1) {
                    theMonth = 0 + theMonth.toString();
                }

                if (theDay.toString().length == 1) {
                    theDay = 0 + theDay.toString();
                }

                let theEventDate = theYear + "-" + theMonth + "-" + theDay;

                eventDateArr.push({
                    eventId: doc.data().creatorId,
                    tags: doc.data().tag,
                    textBody: doc.data().textBody,
                    eventDate: theEventDate,
                    fullEvenDate: d.toString(),
                    names: doc.data().going,
                    address: doc.data().address,
                    title: doc.data().name
                });
            }
        });
    });
}

function color() {
    td = document.getElementsByTagName("td");
    div = document.getElementsByTagName("div");

    for (let i = 0; i < td.length; i++) {
        td[i].style.color = "black";
    }

    for (let i = 0; i < td.length; i++) {
        for (let j = 0; j < eventDateSepArr.length; j++) {
            if (td[i].textContent == eventDateSepArr[j].day &&
                div[8].textContent.startsWith((month_arr[eventDateSepArr[j].monthIndex]) + " " +
                    eventDateSepArr[j].year)
            ) {
                td[i].style.color = "red";
            }
        }
    }
}

YUI().use('calendar', 'datatype-date', 'cssbutton', function (Y) {

    // Create a new instance of calendar, placing it in
    // #mycalendar container, setting its width to 500px,
    // the flags for showing previous and next month's
    // dates in available empty cells to true, and setting
    // the date to today's date.
    var calendar = new Y.Calendar({
        contentBox: "#mycalendar",
        width: '500px',
        showPrevMonth: false,
        showNextMonth: false,
        date: new Date()
    }).render();

    // Get a reference to Y.DataType.Date
    var dtdate = Y.DataType.Date;

    // Listen to calendar's selectionChange event.
    calendar.on("selectionChange", function (ev) {
        let first = true;
        let str = "";
        let result = document.getElementById("result");

        // Get the date from the list of selected
        // dates returned with the event (since only
        // single selection is enabled by default,
        // we expect there to be only one date)
        var newDate = ev.newSelection[0];

        // Format the date and output it to a DOM
        // element.
        Y.one("#selecteddate").setHTML(dtdate.format(newDate));
        for (let i = 0; i < eventDateArr.length; i++) {
            if (eventDateArr[i].eventDate == dtdate.format(newDate) && first) {
                let names = "";
                let tags = "";
                for (let j = 0; j < eventDateArr[i].names.length; j++) {
                    if (names == "") {
                        names = eventDateArr[i].names[j];
                    } else {
                        names = names + ", " + eventDateArr[i].names[j];
                    }
                }

                for (let j = 0; j < eventDateArr[i].tags.length; j++) {
                    tags += "#" + eventDateArr[i].tags[j] + " ";
                }

                first = false;
                str = str + "Title: " + eventDateArr[i].title + "<br>" +
                    "Participants: " + names + "<br>" +
                    "Description: " + eventDateArr[i].textBody + "<br>" +
                    "Tags: " + tags + "<br>" +
                    "Address: " + eventDateArr[i].address + "<br>" +
                    "Time: " + eventDateArr[i].fullEvenDate + "<br>";
            }
        }
        if (str == "") {
            str = "No events scheduled :(";
        }
        result.innerHTML = str;
    });
});

setInterval(function () {
    color();
}, 1000);