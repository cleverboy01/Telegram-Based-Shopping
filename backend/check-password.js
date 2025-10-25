const bcrypt = require('bcryptjs');

const hashFromDb = '<password_hash_from_db>';
const inputPassword = 'kgAkz7d@xYr6P7k';

bcrypt.compare(inputPassword, hashFromDb).then(result => {
  if(result) {
    console.log('رمز صحیح است ✅');
  } else {
    console.log('رمز اشتباه است ❌');
  }
}).catch(err => {
  console.error(err);
});
