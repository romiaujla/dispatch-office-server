# Dispatch Office Server
API for the dispatch office. A react app built using the PERN stack (PostgresSQL, Express, React and Nodejs) which is a transportation management system, which assists freight managers with workflow, automation and scheduling shipments. 

### Links 
- Live Link to App (Front-End deployed on Github Pages)
   - https://romiaujla.github.io/dispatch-office-client/

- Link to Client Repo
   - https://github.com/romiaujla/dispatch-office-client

- Link to API Repo
   - https://github.com/romiaujla/dispatch-office-server

## Set up

Complete the following steps to clone the server:

1. Clone this repository to your local machine `git clone https://github.com/romiaujla/dispatch-office-server.git`
2. `cd` into the cloned repository
4. Install the node dependencies `npm i`
5. For the first time, create a database user `createuser --interactive dunder-mifflin`
6. Don't set a password for the database.
7. Create the database `createdb -U dunder-mifflin dispatch-office`
8. Create the test database `createdb -U dunder-mifflin dispatch-office-test`
9. Run the migrations `npm run migrate` & for test db: `npm run migrate:test`


## Endpoints
- POST /api/auth/login
   - Logs the user in by checking if the username and password match in the DB and returns a jwt authentication token, along with users full name, company name and mc num.

- GET /api/carrier
   - Returns all the shipments and drivers/equipments if any assigned to the carrier

- GET /api/carrier-info
   - Returns the carries information which includes their full name, company name and mc num.

-  GET /api/drivers
   - Returns all the drivers for the carrier who is logged in

-  POST /api/drivers
   - Adds a new driver to the carrier 

- PATCH /api/drivers/:id
   - Updates a driver

- GET /api/equips
   - Returns all the equipments for the carrier who is logged in

- POST /api/equips
   - Adds a new equipments to the carrier

- GET /api/equips/:id
   - Returns the equipment whose id is passed in the params

- PATCH /api/equips/:id
   - Updates an equipment with the id number passed in the params

- POST /api/shipments
   - Adds a new shipment to the carriers list

- PATCH /api/shipments/:id
   - Updates the shipment 

## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests `npm test`

Run the migrations `npm run migrate`

Run migrations for test database `npm run migrate:test`

## Deploying

When your new project is ready for deployment, add a new Heroku application with `heroku create`. This will make a new git remote called "heroku" and you can then `npm run deploy` which will push to this remote's master branch
