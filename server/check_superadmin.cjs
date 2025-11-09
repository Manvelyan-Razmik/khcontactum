// server/check_superadmin.js
require('dotenv').config();
const bcrypt = require('bcryptjs');

(async () => {
  const user = process.env.SUPERADMIN_USERNAME;
  const hash = process.env.SUPERADMIN_PASS_HASH || '';
  console.log('SUPERADMIN_USERNAME=', user);
  console.log('SUPERADMIN_PASS_HASH starts=', hash ? hash.slice(0,10) : '(empty)');
  const ok = await bcrypt.compare('QwertY@2025$$$', hash || '');
  console.log("COMPARE with 'QwertY@2025$$$' =>", ok);
})();
