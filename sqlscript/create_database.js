const AppUsers = require('../AppUsers/resourceAccess/AppUsersResourceAccess');
const AppDevices = require('../AppDevices/resourceAccess/AppDevicesResourceAccess');

async function createDatabase(){
  // create tables
  await AppUsers.initDB();  
  await AppDevices.initDB();
  
  //create views
}
createDatabase();

