Funtivities


- General Info

Funtivities is a web application that helps the user
to find new people to do various fun activities with.
First the user must login. Then they can create new
events, check out their own events in their profile
page and on their calendar, and check out other
users' events. This small project demonstrates:

  - read and write to firebase, a non-sql database
  - use of firebase authentication and creation of a users collection in firestore
  - customized user experience after login/signup
  - tracking of a data point provided by the user
  - use of navbar in boostrap
  - use of calendar


- Technologies

Technologies that were used for this project:

  - Firebase Hosting
  - Firebase Firestore Database
  - HTML, CSS
  - JavaScript
  - Bootstrap
  - YUI


- Content

Content of the project folder:

   Top level of project folder:
  ├── .gitignore               # Git ignore file
  ├── .gitignore.txt           # Git ignore file
  ├── 404.html                 # File for error
  ├── index.html               # landing HTML file, this is what users see when you come to url
  ├── main.html                # after logged in, this the main menu
  ├── find-event.html          # page to check out all the events
  ├── event-creation.html      # page to create a new event
  ├── calendar.html            # page to check out your calendar which show the events that you created
  ├── profile.html             # page to check your name and all the events whether they user created them or not
  └── README.txt

  It has the following subfolders:
  ├── .firebase                # Folder for firebase
  ├── .git                     # Folder for git repo
  ├── images                   # Folder for images
  ├── scripts                  # Folder for scripts
    /calendar.js               # This is where all the core functions of the calendar are located
				 (separate js file because of using a unique library compare to other pages
    /firebase_api.js           # This is where all the core functions of firebase are located	
    /scripts.js                # This is where all the core functions are located
  ├── styles                   # Folder for styles
    /myStyle.css               # All the styling of the app

  Firebase hosting files: 
  ├── .firebaserc              # Firebase file
  ├── firebase.json            # Firebase file
  ├── firestore.indexes.json   # Firebase file
  ├── firestore.rules          # Rules for read/write to firestore
