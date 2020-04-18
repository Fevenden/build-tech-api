# Express Boilerplate!

This is a boilerplate project used for starting new projects! Anyone can use this as they like to quickly get exress applications up and running. 

## Set Up 

Complete the following steps to start a new project:

1. Clone this repo to you local machine 'git clone https://github.com/Fevenden/express-boilerplate.git YOUR-NEW-PROJECT-NAME'
2. 'cd' into the cloned repo
3. Make a fresh start of the git history with 'rm -rf .git $$ git init'
4. Install node dependencies 'npm install'
5. With 'mv example.env .env' move contents of 'example.env' file to '.env' which git will ignore and the express server will read. 
6. Be sure to go to package.json and change the name of your project.

## Scripts

"npm start" to start application

"npm run dev" will start nodemon for the application

"npm test" will run tests using mocha

## Deploying

When your new project is ready for deployment, add a new heroku application with 'heroku create'. This will add "heroku" as a git remote and you can then 'npm run deploy' which will push to heroku master branch.