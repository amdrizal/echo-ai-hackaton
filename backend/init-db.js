const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('render.com') || process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : undefined,
});

async function initDatabase() {
  try {
    console.log('🔧 Connecting to database...');

    const sqlFile = fs.readFileSync(
      path.join(__dirname, 'scripts', 'init-db.sql'),
      'utf8'
    );

    console.log('📝 Executing database schema...');
    await pool.query(sqlFile);

    console.log('✅ Database initialized successfully!');
    console.log('');
    console.log('📊 Checking tables...');

    const result = await pool.query(`
      SELECT COUNT(*) as user_count FROM users;
    `);

    console.log(`✓ Users table: ${result.rows[0].user_count} user(s)`);

    const goalsResult = await pool.query(`
      SELECT COUNT(*) as goal_count FROM goals;
    `);

    console.log(`✓ Goals table: ${goalsResult.rows[0].goal_count} goal(s)`);
    console.log('');
    console.log('🎉 Ready to test!');

  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

initDatabase();
