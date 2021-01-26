# Foodie
A social media for food lovers and for people looking for new ideas for their next menu. A facebook/instagram-like inspired social media.

![Heroku](https://heroku-badge.herokuapp.com/?app=foodie-social) ![Vercel](https://vercelbadge.vercel.app/api/jgudo/foodie)



## Table of contents
* [Features](#features)
* [Technologies](#technologies)
* [Installation](#installation)
* [Run Locally](#run_local)
* [Deployment](#deployment)
* [Screenshots](#screenshots)

## Features
This web app consists of a basic features/functionalities of a socia media
* Login and Registration
* Notification
* Private Messaging
* Post CRUD functionality
* Comment feature
* Profile Customization
* Followers/Following feature
* Search Feature

## Technologies
|   Front End |  Back End   |
| ----------- | ------------|
| React 17.0.1| Node 12.18.1|
| TypeScript  | MongoDB     |
| Redux       | Mongoose    |
| Redux-Saga  | SocketIO    |
| React Router| Express JS  |
| TailwindCSS | Passport JS |
| PostCSS     | Google Cloud Storage|
| Axios       |             |

## Installation
To install both ends (frontend/server). 
```
$ npm run init-project
```

Or to install them individually
```
$ cd frontend // or cd server
$ npm install
```

## Run locally
Before running the project, make sure to have the following done:
* Download and install [MongoDB](https://www.mongodb.com/)
* Create [Firebase Project](https://console.firebase.google.com/u/0/) for storage bucket
* Create Google Service Account json key and configure ENV variable to your machine

Create ```.env-dev``` or ```.end-prod``` env variables and set the following:
```
MONGODB_URI=<mongodb uri | default local = mongodb://localhost:27017 >
DB_NAME=<your database name>
PORT=<port eg: 9000>
CLIENT_URL=<your frontend url, default: http://localhost:3000>
SESSION_SECRET=<any secret key>
SESSION_NAME=<any name you want>
FIREBASE_PROJECT_ID=<firebase project id found on your firebase config settigs>
FIREBASE_STORAGE_BUCKET_URL=<firebase bucket url found on your firebase config settigs>
GOOGLE_APPLICATION_CREDENTIALS=<if you haven't set the ENV variable in your machine, you can set the relative path of the json file here>
FACEBOOK_CLIENT_ID=<you app client id>
FACEBOOK_CLIENT_SECRET=<you app client secret>
GITHUB_CLIENT_ID=<you app client id>
GITHUB_CLIENT_SECRET=<you app client id>
```

You can get your Facebook client id/secret here [Facebook for developers](http://developers.facebook.com/) and for GitHub here [Register Github OAuth App](https://github.com/settings/applications/new) and set the necessary env vars above.  

After doing the steps above, you have to run your ```Mongo Server``` and finally you can now run both ends simultaneously by running: 
```
$ npm start
```

Or you can run them individually
```
$ npm run start-client // frontend
$ npm run start-server // backend

// Or you can change to individual directory then run 
$ cd frontend // or cd server
$ npm start
```

## Deployment
You can deploy your react app in [Vercel](http://vercel.app/) or whatever your preferred deployment platform. 
And for the backend, you can deploy your server in [Heroku](https://heroku.com)

## Screenshots

![Foodie screenshot](https://raw.githubusercontent.com/jgudo/foodie/master/frontend/src/images/screen1.png)
![Foodie screenshot](https://raw.githubusercontent.com/jgudo/foodie/master/frontend/src/images/screen2.png)
![Foodie screenshot](https://raw.githubusercontent.com/jgudo/foodie/master/frontend/src/images/screen3.png)
![Foodie screenshot](https://raw.githubusercontent.com/jgudo/foodie/master/frontend/src/images/screen4.png)
