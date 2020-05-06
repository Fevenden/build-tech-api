# BuildTech API

This is an API for my BuildTech client project. 

Live [App](https://fallout-4-build-manager.now.sh/)

## Motivation 

Fallout 4's character creation does a poor job of telling you exactly what perks are available to you when you first create your character. Because of this every time I created a new character I'd spend a lot of time googling which stats unlock which perks. I wanted to create an app that could provide users all of this information in one place while remaining simple to use. I also added the ability for users to save their builds for reference later.

## Technology used

BuildTech was built using React, Nodejs, Express, and PostgreSQL. It is a Full-Stack web app and you can view the client repo at this [Link](https://github.com/f3ve/Build-Tech-Client).

## Endpoints

All endpoints start with /api

### /users Endpoint

this endpoint accepts POSTS requests and adds a new user to the Database

### /builds Endpoint

this endpoint requires authorization

GET requests return all a users builds

POST requests add a build to the database

### /builds/:build_id Endpoint

Requires authorization

GET requests return the build that has the requested id

DELETE requests remove the build that has the requested id from the database

### /auth/login Enpoint

POST requests validate the username and password and return an auth-token

