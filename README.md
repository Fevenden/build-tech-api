# BuildTech API

This is an API for my BuildTech client project. 

Live [App](https://build-tech.now.sh/)

## Motivation 

Fallout 4's character creation does a poor job of telling you exactly what perks are available to you when you first create your character. Because of this every time I created a new character I'd spend a lot of time googling which stats unlock which perks. I wanted to create an app that could provide users all of this information in one place while remaining simple to use. I also added the ability for users to save their builds for reference later.

## Technology used

BuildTech was built using React, Nodejs, Express, and PostgreSQL. It is a Full-Stack web app and you can view the client repo at this [Link](https://github.com/f3ve/Build-Tech-Client).

## How To Set Up

Create a database called build_tech and one called build_tech-test:

```bash
createdb build_tech
```

```bash
createdb build_tech-test
```

Create database user: 
```bash
createuser build_tech 
```

Grant priviliges to new user in psql:

```psql
GRANT ALL PRIVILIGES ON DATABASE build_tech TO build_tech
```

```psql
GRANT ALL PRIVILIGES ON DATABASE "build_tech-test" TO build_tech
```

prepare a .env file with required variables.

migrate the databases: 

```bash
npm run migrate
```

```bash
npm run migrate:test
```

seed sample for each table data with:

```bash
psql -U build_tech -d build_tech -a -f seeds/seed.example_seed.sql
```

make sure your timezone is set to 'UTC' in your postgresql.conf file.

## Scripts 

Run in development mode:

```bash
npm run dev
```

Run tests: 
```bash
npm test
```

Migrate the database:
```bash
npm run migrate
```

Migrate test database:
```bash
npm run migrate:test
```

Deploy to heroku:
```bash
npm run deploy
```

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

