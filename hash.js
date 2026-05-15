const bcrypt = require("bcryptjs");

async function run() {
  const hash = await bcrypt.hash("Test@123", 10);
  console.log(hash);
}

run();
