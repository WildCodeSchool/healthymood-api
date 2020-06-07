# Before cloning the repo
```sh
git config --global core.autocrlf input
```
(just re-clone if already cloned).

# Setup

Install dependencies and the migration tool :
```sh
npm i
npm i -g db-migrate db-migrate-mysql
```
Copy the environnement variables : 
```
cp .env.sample .env
```
This `.env` file allows to change the way the Node server connects to the database, but you probably won't have to change any of those variables unless you want to deploy the app yourself and connect it to a specific DB.

## With Docker (recommanded)

Install Docker on your OS.

### I just want to run the existing app without making changes to the code
```sh
docker-compose up --build
```
That will install and run the app with all its dependencies (including the DB) in isolated containers. With this single command, you will have a fully functionnal API listening by default on `localhost:3000`. 

You will also have two running DB servers (one for developpement and one for running automated tests), accessible respectively on `localhost:3307` and `localhost:3308` with the user `root` and the password `root`.

### I want to develop the app

Alternatively, you can just bring up the db and run the app outside a container :
```sh
docker-compose up db #(wait until the console stop outputing stuff)
npm run migrate
npm run start-watch
```
That may be useful when developpping since you won't have to rebuild and re-run the NodeJS container every time when a change is made in the code.

### I want to run the automated tests
```sh
npm run tests:setup-db #(wait until the test DB is accessible at localhost:3308)
npm run tests:migrate-db
npm run test
```

## Without Docker

Install MySQL (5.7) on your OS. 
Then, create two MySQL server instances, both accessible with the user `root` and the password `root` : 
- One listening on port 3307 with an empty database called `customer_api_database`. 
- One listening on port 3308 with an empty database called `customer_api_database_test`.

### Run the app

```sh
npm run migrate
npm run start-watch
```

### Run the automated tests

```sh
npm run tests:migrate-db
npm run test
```

# Docs
You can access the docs at [localhost:3000/api-docs](http://localhost:3000/api-docs)
