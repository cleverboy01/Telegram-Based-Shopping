require('dotenv').config();
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const db = new Database('./shop.db');

(async () => {
  const password = 'kgAkz7d@xYr6P7k';
  const passwordHash = await bcrypt.hash(password, 10);
  db.prepare(`
    INSERT OR REPLACE INTO users (id, email, mobile, name, role, password_hash, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    'admin-main',                // id
    'admin@shop.com',            // email
    '09123456789',               // mobile
    'ادمین اصلی',                // name
    'admin',                     // role
    passwordHash,                // password_hash
    new Date().toISOString()     // created_at
  );
  console.log('✅ یوزر ادمین سایت با ایمیل admin@shop.com و پسورد kgAkz7d@xYr6P7k اضافه شد!');
  db.close();
})();
