require('dotenv').config();
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');

const CHAT_ID = parseInt(process.env.MAIN_ADMIN_CHAT_ID);
const db = new Database('./shop.db');

const password = 'kgAkz7d@xYr6P7k';

async function addAdmin() {
  if (!CHAT_ID || isNaN(CHAT_ID)) {
    console.error('❌ MAIN_ADMIN_CHAT_ID not set or invalid in .env');
    console.log(`   Current value: ${process.env.MAIN_ADMIN_CHAT_ID}`);
    process.exit(1);
  }

  console.log(`📝 Adding admin with Chat ID: ${CHAT_ID}`);

  const passwordHash = await bcrypt.hash(password, 10);

  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS admins (
        chat_id INTEGER PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_by INTEGER,
        is_main_admin INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const existing = db.prepare('SELECT * FROM admins WHERE chat_id = ?').get(CHAT_ID);
    
    if (existing) {
      console.log('⚠️  Admin already exists. Deleting old admin...');
      db.prepare('DELETE FROM admins WHERE chat_id = ?').run(CHAT_ID);
    }
    
    db.prepare(`
      INSERT INTO admins (chat_id, username, password_hash, is_main_admin, created_by)
      VALUES (?, ?, ?, 1, ?)
    `).run(CHAT_ID, 'main_admin', passwordHash, CHAT_ID);
    
    console.log('\n✅ Admin added successfully!');
    console.log(`   Chat ID: ${CHAT_ID}`);
    console.log(`   Username: main_admin`);
    console.log(`   Password: ${password}`);
    
    const admins = db.prepare('SELECT * FROM admins').all();
    console.log('\n👥 All admins in database:');
    admins.forEach(admin => {
      console.log(`   - ${admin.username} (Chat ID: ${admin.chat_id})${admin.is_main_admin ? ' ⭐ Main Admin' : ''}`);
    });
    
    console.log('\n✅ Done! Now restart the bot and use new password!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    db.close();
  }
}

addAdmin();
