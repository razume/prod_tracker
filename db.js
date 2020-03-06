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
    `;
  await client.query(SQL);
  await createActivity({ text: 'Went for a run', type: 'productive' });
  await createActivity({ text: 'Read the React docs', type: 'productive' });
  await createActivity({ text: 'Slept for 8 hours', type: 'productive' });
  await createActivity({ text: 'Went for a jog', type: 'productive' });
};

const readActivities = async () => {
  return (await client.query('SELECT * FROM activities')).rows;
};

const createActivity = async ({ text, type }) => {
  const SQL = 'INSERT INTO activities(text, type) VALUES($1, $2) RETURNING *';
  return (await client.query(SQL, [text, type])).rows[0];
};

const updateActivity = async ({ text, type, id }) => {
  const SQL =
    'UPDATE activities SET text = $1, type = $2 WHERE id = $3 RETURNING *';
  const response = await client.query(SQL, [text, type, id]);
  return response.rows[0];
};

const deleteActivity = async id => {
  const SQL = 'DELETE FROM activities WHERE id = $1;';
  await client.query(SQL, [id]);
};

module.exports = {
  sync,
  readActivities,
  createActivity,
  updateActivity,
  deleteActivity
};
