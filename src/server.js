const app = require('./app');
const { PORT, DATABASE_URL } = require('./config');

const knex = require('knex');
const db = knex({
    client: 'pg',
    connection: process.env.DATABASE_URL || DATABASE_URL
})

app.set('db', db);

app.listen(PORT, () => {
    console.log(`Sever listening at PORT:${PORT}`);
})