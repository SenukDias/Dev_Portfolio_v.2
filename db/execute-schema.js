const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');

pool.query(schema, (err, res) => {
  if (err) {
    console.error('Error executing schema:', err);
  } else {
    console.log('Schema executed successfully');
  }
  pool.end();
});
