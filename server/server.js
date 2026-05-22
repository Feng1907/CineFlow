require('dotenv').config();

// Viettel DNS does not support SRV records required by mongodb+srv://
// Force Google DNS so mongoose can resolve Atlas hostnames
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

const app = require('./src/app');
const { port } = require('./src/config/env');

app.listen(port, () => {
  console.log(`🎬 CineFlow server running on http://localhost:${port}`);
});
