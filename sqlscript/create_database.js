const Staff = require('../API/Staff/resourceAccess/StaffResourceAccess');
const Role = require('../API/Role/resourceAccess/RoleResourceAccess');
const RoleStaffView = require('../API/Staff/resourceAccess/RoleStaffView');
const AppUsers = require('../API/AppUsers/resourceAccess/AppUsersResourceAccess');
const Permission = require('../API/Permission/resourceAccess/PermissionResourceAccess');
const Books = require('../API/Books/resourceAccess/BooksResourceAccess');
const BooksCategory = require('../API/BooksCategory/resourceAccess/BooksCategoryResourceAccess');

async function createDatabase(){
  // create tables
  // await AppUsers.initDB();  
  // await Permission.initDB();
  // await Role.initDB();
  // await Staff.initDB();
  // await BooksCategory.initDB();
  // await Books.initDB();
  //create views
  // RoleStaffView.initViews();
}
createDatabase();

