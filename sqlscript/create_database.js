const Staff                 = require('../API/Staff/resourceAccess/StaffResourceAccess');
const Role                  = require('../API/Role/resourceAccess/RoleResourceAccess');
const RoleStaffView         = require('../API/Staff/resourceAccess/RoleStaffView');
const AppUsers              = require('../API/AppUsers/resourceAccess/AppUsersResourceAccess');
const Permission            = require('../API/Permission/resourceAccess/PermissionResourceAccess');
const Books = require('../API/Books/resourceAccess/BooksResourceAccess');
const SystemAppLog          = require('../API/SystemAppChangedLog/resourceAccess/SystemAppChangedLogResourceAccess');
const UploadResource        = require('../API/Upload/resourceAccess/UploadResourceAccess');
const CustomerMessage       = require('../API/CustomerMessage/resourceAccess/CustomerMessageResourceAccess');
const MessageCustomer       = require('../API/CustomerMessage/resourceAccess/MessageCustomerResourceAccess');
const MessageCustomerView   = require('../API/CustomerMessage/resourceAccess/MessageCustomerView');
async function createDatabase(){
  // //create tables
  // await AppUsers.initDB();  
  // await Permission.initDB();
  // await Role.initDB();
  // await Staff.initDB();
  // await SystemAppLog.initDB();
  // await UploadResource.initDB();

  //we use 1 table to store content of message & 1 table to store need-to-send customer
  // await CustomerMessage.initDB();
  // await MessageCustomer.initDB();

  // //create views
  // RoleStaffView.initViews();
  // MessageCustomerView.initViews();
}
createDatabase();

