const bcrypt = require('bcrypt');

(async () => {
  const password = 'admin123'; // password admin yang mau dibuat
  const hashed = await bcrypt.hash(password, 10);
  console.log(hashed);
})();
