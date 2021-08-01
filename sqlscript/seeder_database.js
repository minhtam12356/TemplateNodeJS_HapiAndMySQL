const User = require('../User/resourceAccess/UserResourceAccess');

async function seedDatabase() {
  console.log("seedDatabase");
  let users = await User.find({}, 0, 10);

  for (let i = 0; i < users.length; i++) {
    const user = users[i];

  }
}

for (let i = 0; i < 10; i++) {
  seedDatabase();
}


