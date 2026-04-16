const { Pool } = require('pg');
require('dotenv').config();

const pgPool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

pgPool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('❌ SQL Connection Error:', err.stack);
    } else {
        console.log('✅ SQL Connected (PostgreSQL)');
    }
});
module.exports = pgPool;
