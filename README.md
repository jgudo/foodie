# Foodie
A social media for food lovers and for people looking for new ideas for their next menu. A facebook/instagram-like inspired social media.

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

After doing the steps above, you can now run both ends simultaneously by running: 
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

## Screenshots
