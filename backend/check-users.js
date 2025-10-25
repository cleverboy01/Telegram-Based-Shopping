const Database = require('better-sqlite3');
const db = new Database('./shop.db');

console.log('?? Checking users in database...\n');
console.log('='.repeat(60));

try {
  const users = db.prepare('SELECT * FROM users').all();
  
  if (users.length === 0) {
    console.log('\n? No users found in database!');
    console.log('\n?? You need to create users first.');
    console.log('   Run: node add-admin.js');
  } else {
    console.log(`\n? Found ${users.length} user(s) in database:\n`);
    
    users.forEach((user, index) => {
      console.log(`?? User #${index + 1}:`);
      console.log(`   ?? Email: ${user.email}`);
      console.log(`   ?? ID: ${user.id}`);
      console.log(`   ?? Role: ${user.role || 'N/A'}`);
      console.log(`   ?? Name: ${user.name || 'N/A'}`);
      console.log(`   ?? Password Hash: ${user.password_hash ? user.password_hash.substring(0, 30) + '...' : '? NO PASSWORD'}`);
      console.log(`   ?? Created: ${user.created_at || 'N/A'}`);
      console.log(`   ?? Has Valid Password: ${user.password_hash && user.password_hash.length > 50 ? '? Yes' : '? No'}`);
      console.log('');
    });
    
    console.log('='.repeat(60));
    
    const admin = users.find(u => u.email === 'admin@shop.com');
    if (admin) {
      console.log('\n? Admin user (admin@shop.com) EXISTS!');
      if (!admin.password_hash || admin.password_hash.length < 50) {
        console.log('??  WARNING: Admin password is not properly hashed!');
        console.log('   Run: node add-admin.js to fix this');
      }
    } else {
      console.log('\n? Admin user (admin@shop.com) NOT FOUND!');
      console.log('   Run: node add-admin.js to create it');
    }
  }
  
  console.log('\n?? Table structure:');
  const tableInfo = db.prepare('PRAGMA table_info(users)').all();
  console.table(tableInfo.map(col => ({
    Column: col.name,
    Type: col.type,
    Required: col.notnull ? 'Yes' : 'No',
    Default: col.dflt_value || 'NULL'
  })));
  
} catch (error) {
  console.error('\n?? Error:', error.message);
  console.error('\n?? Make sure:');
  console.error('   1. shop.db file exists');
  console.error('   2. users table is created');
  console.error('   3. You are in the correct directory');
}

db.close();
console.log('\n? Database connection closed.');
