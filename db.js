const pg = require('pg');
const client = new pg.Client(
  process.env.DATABASE_URL || 'postgres://localhost/productivity_db'
);

client.connect();

const sync = async () => {
  const SQL = `
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
        DROP TABLE IF EXISTS activities;
        DROP TABLE IF EXISTS users;
        CREATE TABLE users(
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          username VARCHAR(10) UNIQUE NOT NULL,
          CHECK (char_length(username) > 1),
          password VARCHAR(10) NOT NULL,
          CHECK (char_length(password) > 5)
        );
        CREATE TABLE activities(
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            text VARCHAR(255),
            type VARCHAR,
            "userId" UUID REFERENCES users(id)
        );
    `;
  await client.query(SQL);

  // test data below
  const testUser1 = await createUser({
    username: 'lap598',
    password: 'qwerty'
  });
  const testUser2 = await createUser({
    username: 'tom',
    password: 'qwerty'
  });
  const testUser3 = await createUser({
    username: 'moe',
    password: 'qwerty'
  });
  await createActivity({
    text: 'studied for two hours',
    type: 'productive',
    userId: testUser1.id
  });
  await createActivity({
    text: 'Went for a run',
    type: 'productive',
    userId: testUser1.id
  });
  await createActivity({
    text: 'Read the React docs',
    type: 'productive',
    userId: testUser2.id
  });
  await createActivity({
    text: 'Slept for 8 hours',
    type: 'productive',
    userId: testUser2.id
  });
  await createActivity({
    text: 'Went for a jog',
    type: 'productive',
    userId: testUser3.id
  });
};

const readUsers = async () => {
  return (await client.query('SELECT * FROM users')).rows;
};

const readActivities = async () => {
  return (await client.query('SELECT * FROM activities')).rows;
};

const createUser = async ({ username, password }) => {
  const SQL =
    'INSERT INTO users(username, password) VALUES($1, $2) RETURNING *';
  return (await client.query(SQL, [username, password])).rows[0];
};

const createActivity = async ({ text, type, userId }) => {
  const SQL =
    'INSERT INTO activities(text, type, "userId") VALUES($1, $2, $3) RETURNING *';
  return (await client.query(SQL, [text, type, userId])).rows[0];
};

const updateUser = async ({ username, password, id }) => {
  const SQL =
    'UPDATE users SET username = $1, password = $1 WHERE id = $3 RETURNING *';
  const response = await client.query(SQL, [username, password, id]);
  return response.rows[0];
};

const updateActivity = async ({ text, type, id }) => {
  const SQL =
    'UPDATE activities SET text = $1, type = $2 WHERE id = $3 RETURNING *';
  const response = await client.query(SQL, [text, type, id]);
  return response.rows[0];
};

const deleteUser = async id => {
  const activitiesSQL = 'DELETE FROM activities WHERE "userId" = $1;';
  const usersSQL = 'DELETE FROM users WHERE id = $1;';
  await client.query(activitiesSQL, [id]);
  await client.query(usersSQL, [id]);
};

const deleteActivity = async id => {
  const SQL = 'DELETE FROM activities WHERE id = $1;';
  await client.query(SQL, [id]);
};

module.exports = {
  sync,
  readUsers,
  readActivities,
  createUser,
  createActivity,
  updateUser,
  updateActivity,
  deleteUser,
  deleteActivity
};
