const Database = require('better-sqlite3');
const db = new Database('./shop.db');

const email = 'admin@shop.com';

const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

if (user) {
  console.log('✅ User found:', user);
} else {
  console.log('❌ User NOT found.');
}

db.close();
