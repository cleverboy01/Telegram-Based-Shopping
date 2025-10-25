const Database = require('better-sqlite3');
const db = new Database('./shop.db');

try {
  db.exec(`
    ALTER TABLE users ADD COLUMN password_hash TEXT;
  `);
  console.log('✅ ستون password_hash به جدول users اضافه شد!');
} catch (error) {
  if (error.message.includes('duplicate column') || error.message.includes('already exists')) {
    console.log('ℹ️ ستون password_hash قبلا وجود داشته یا خطا مشابه.');
  } else {
    console.error('❌ خطا:', error.message);
  }
}
db.close();
