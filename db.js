const pg = require('pg');
const client = new pg.Client(
  process.env.DATABASE_URL || 'postgres://localhost/productivity_db'
);

client.connect();

const sync = async () => {
  const SQL = `
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
        DROP TABLE IF EXISTS activities;
        CREATE TABLE activities(
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            text VARCHAR(255),
            type VARCHAR
        );

        INSERT INTO activities(text, type) VALUES('Played video games for six hours', 'unproductive');
        INSERT INTO activities(text, type) VALUES('Read the React docs', 'productive')
    `;
  await client.query(SQL);
};

const readActivities = async () => {
  return (await client.query('SELECT * FROM activities')).rows;
};

const createActivity = async (activityName, activityType) => {
  const SQL = 'INSERT INTO activities(text, type) VALUES($1, $2) RETURNING *';
  return (await client.query(SQL, [activityName, activityType])).rows[0];
};

module.exports = {
  sync,
  readActivities
};
