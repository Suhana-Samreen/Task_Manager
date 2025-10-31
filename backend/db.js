const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const DB_PATH = path.join(__dirname, 'data.sqlite');

function getDb() {
  const db = new sqlite3.Database(DB_PATH);
  return db;
}

function runMigration() {
  const sqlPath = path.join(__dirname, 'migrations', 'init.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');
  const db = getDb();
  db.exec(sql, (err) => {
    if (err) {
      console.error('Migration failed:', err);
      process.exit(1);
    } else {
      console.log('Migration finished.');
      db.close();
    }
  });
}

if (require.main === module) {
  const argv = process.argv;
  if (argv[2] === 'init') {
    runMigration();
  } else {
    console.log('Usage: node db.js init');
  }
}

module.exports = { getDb };
