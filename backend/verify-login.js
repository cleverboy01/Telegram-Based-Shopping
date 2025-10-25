const db = require('./database');
const bcrypt = require('bcryptjs');

(async () => {
  const email = 'admin@shop.com';
  const testPasswords = ['admin123', '123789'];
  
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  
  if (!user) {
    console.log('❌ کاربر یافت نشد');
    return;
  }
  
  for (const pwd of testPasswords) {
    const res = await bcrypt.compare(pwd, user.password_hash);
    console.log(`رمز "${pwd}" معتبر است؟`, res);
  }
})();
