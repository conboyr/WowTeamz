const bcrypt = require("bcrypt");

// Allows user to input password
const password = process.argv[2];

if (!password) {
  console.error("Password does not exist");
  process.exit(1);
}

// Determine the salt rounds
const hashRounds = 10;

bcrypt.hash(password, hashRounds, (error, hash) => {
  if (error) {
    console.error("Error producing bcrypt hash:", error);
    return;
  }
  console.log("Bcrypt hash:", hash);
});
