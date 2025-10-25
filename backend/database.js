const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');

const db = new Database('./backend/shop.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS admins (
    chat_id INTEGER PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_by INTEGER,
    is_main_admin INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    sku TEXT UNIQUE,
    name TEXT NOT NULL,
    slug TEXT UNIQUE,
    description TEXT,
    brand TEXT,
    category TEXT,
    price REAL NOT NULL,
    discount_price REAL,
    stock INTEGER DEFAULT 0,
    images TEXT,
    main_image TEXT,
    features TEXT,
    rating REAL DEFAULT 0,
    status TEXT DEFAULT 'published',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    order_number TEXT UNIQUE,
    user_id TEXT,
    customer_name TEXT,
    customer_phone TEXT,
    items TEXT,
    subtotal REAL,
    shipping REAL,
    discount REAL,
    total REAL,
    status TEXT DEFAULT 'pending',
    payment_method TEXT,
    shipping_method TEXT,
    shipping_address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE,
    mobile TEXT,
    name TEXT,
    password_hash TEXT,
    role TEXT DEFAULT 'customer',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

try {
  db.exec(`ALTER TABLE users ADD COLUMN password_hash TEXT;`);
} catch (error) {
  if (!error.message.includes('duplicate column name')) {
    console.error('Error adding password_hash column:', error.message);
  }
}

async function initMainAdmin() {
  const mainAdminChatId = process.env.MAIN_ADMIN_CHAT_ID;
  
  if (!mainAdminChatId) {
return;
  }

  const existing = db.prepare('SELECT * FROM admins WHERE chat_id = ?').get(mainAdminChatId);
  
  if (!existing) {
    const password = '123789';
    const passwordHash = await bcrypt.hash(password, 10);
    
    db.prepare(`
      INSERT INTO admins (chat_id, username, password_hash, is_main_admin, created_by)
      VALUES (?, ?, ?, 1, ?)
    `).run(mainAdminChatId, 'main_admin', passwordHash, mainAdminChatId);
console.log(`   Chat ID: ${mainAdminChatId}`);
console.log(`   Password: ${password}`);
  }
}

async function initWebAdmin() {
  try {
    const adminEmail = 'admin@shop.com';
    const existing = db.prepare('SELECT * FROM users WHERE email = ?').get(adminEmail);
    
    if (!existing) {
      const password = '123789';
      const passwordHash = await bcrypt.hash(password, 10);
      
      db.prepare(`
        INSERT INTO users (id, email, name, password_hash, role, created_at)
        VALUES (?, ?, ?, ?, ?, datetime('now'))
      `).run('admin-main', adminEmail, 'ادمین اصلی', passwordHash, 'admin');
console.log(`   Email: ${adminEmail}`);
} else {
}
  } catch (error) {
    console.error('Error creating web admin:', error.message);
  }
}

Promise.all([initMainAdmin(), initWebAdmin()]).catch(console.error);

module.exports = db;
