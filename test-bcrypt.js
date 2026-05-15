const bcrypt = require('bcryptjs');

const password = 'NutritionAyur@2024!';
const hash = '$2a$10$dj8udMzZYif90XbZOXtEleyQ3ClumcYq2zrSy9psvSKtZCWyvA1tW';

bcrypt.compare(password, hash).then(result => {
  console.log('Password matches hash:', result);
  process.exit(result ? 0 : 1);
});
