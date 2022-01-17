const Staff                 = require('../API/Staff/resourceAccess/StaffResourceAccess');
const Role                  = require('../API/Role/resourceAccess/RoleResourceAccess');
const RoleStaffView         = require('../API/Staff/resourceAccess/RoleStaffView');
const AppUsers              = require('../API/AppUsers/resourceAccess/AppUsersResourceAccess');
const Permission            = require('../API/Permission/resourceAccess/PermissionResourceAccess');
const Books = require('../API/Books/resourceAccess/BooksResourceAccess');
const SystemAppLog          = require('../API/SystemAppChangedLog/resourceAccess/SystemAppChangedLogResourceAccess');
const UploadResource        = require('../API/Upload/resourceAccess/UploadResourceAccess');

//Payment modules
const PaymentMethod = require('../API/PaymentMethod/resourceAccess/PaymentMethodResourceAccess');
const PaymentRecord = require('../API/PaymentRecord/resourceAccess/PaymentRecordResourceAccess');
const PaymentDepositResource = require('../API/PaymentDepositTransaction/resourceAccess/PaymentDepositTransactionResourceAccess');
const PaymentDepositUserView = require('../API/PaymentDepositTransaction/resourceAccess/PaymentDepositTransactionUserView');
const SummaryUserPaymentDepositTransactionView = require('../API/PaymentDepositTransaction/resourceAccess/SummaryUserPaymentDepositTransactionView');
const PaymentExchangeResource = require('../API/PaymentExchangeTransaction/resourceAccess/PaymentExchangeTransactionResourceAccess');
const PaymentExchangeUserView = require('../API/PaymentExchangeTransaction/resourceAccess/ExchangeTransactionUserView');
const SummaryUserExchangeTransactionView = require('../API/PaymentExchangeTransaction/resourceAccess/SummaryUserExchangeTransactionView');
const PaymentWithdrawResource = require('../API/PaymentWithdrawTransaction/resourceAccess/PaymentWithdrawTransactionResourceAccess');
const SummaryUserWithdrawTransactionView = require('../API/PaymentWithdrawTransaction/resourceAccess/SummaryUserWithdrawTransactionView');
const WithdrawTransactionUserView = require('../API/PaymentWithdrawTransaction/resourceAccess/WithdrawTransactionUserView');
const PaymentServicePackage = require('../API/PaymentServicePackage/resourceAccess/PaymentServicePackageResourceAccess');
const PaymentServicePackageUserResourceAccess = require('../API/PaymentServicePackage/resourceAccess/PaymentServicePackageUserResourceAccess');
const UserServicePackageViews = require('../API/PaymentServicePackage/resourceAccess/UserServicePackageViews');
const ServicePackageWalletViews = require('../API/PaymentServicePackage/resourceAccess/ServicePackageWalletViews');
const ServicePackageUnitViews = require('../API/PaymentServicePackage/resourceAccess/PackageUnitView');
const UserBonusPackage = require('../API/PaymentServicePackage/resourceAccess/UserBonusPackageResourceAccess');
const SummaryPaymentServicePackageUserView = require('../API/PaymentServicePackage/resourceAccess/SummaryPaymentServicePackageUserView');
const BetRecordsResource = require('../API/BetRecords/resourceAccess/BetRecordsResourceAccess');
const UserBetRecordsViews = require('../API/BetRecords/resourceAccess/UserBetRecordsView');

const CustomerMessage       = require('../API/CustomerMessage/resourceAccess/CustomerMessageResourceAccess');
const MessageCustomer       = require('../API/CustomerMessage/resourceAccess/MessageCustomerResourceAccess');
const MessageCustomerView   = require('../API/CustomerMessage/resourceAccess/MessageCustomerView');
async function createDatabase(){
  //*************CREATE TABLES******************
  // //User modules
  // await AppUsers.initDB();  // << khi reset user nhớ reset Wallet để nó ra ví tương ứng
  // await Wallet.initDB();
  // await WalletBalanceUnit.initDB();
  // await WalletBalanceView.initViews();

  // //Staff modules
  // await Permission.initDB();
  // await Role.initDB();
  // await Staff.initDB();

  // //System / Utilities modules
  // await SystemAppLog.initDB();
  // await UploadResource.initDB();
  // SystemConfiguration.initDB();
  //we use 1 table to store content of message & 1 table to store need-to-send customer
  // await CustomerMessage.initDB();
  // await MessageCustomer.initDB();

  // //Payment modules
  // await PaymentMethod.initDB();
  // await PaymentRecord.initDB();
  // await PaymentDepositResource.initDB();
  await PaymentDepositUserView.initViews();
  await SummaryUserPaymentDepositTransactionView.initViews();
  // await PaymentServicePackage.initDB();
  // await PaymentServicePackageUserResourceAccess.initDB();
  await UserServicePackageViews.initViews();
  // await PaymentWithdrawResource.initDB();
  await SummaryUserWithdrawTransactionView.initViews();
  await WithdrawTransactionUserView.initViews();
  // await PaymentExchangeResource.initDB();
  await SummaryUserExchangeTransactionView.initViews();
  await PaymentExchangeUserView.initViews();
  await ServicePackageWalletViews.initViews();
  await ServicePackageUnitViews.initViews();
  await SummaryPaymentServicePackageUserView.initViews();
  // await UserBonusPackage.initDB();
  
  //Bet Records
  // await BetRecordsResource.initDB();
  // await UserBetRecordsViews.initViews();

  // //***************** CREATE VIEWS *******************
  // RoleStaffView.initViews();
  // MessageCustomerView.initViews();
  // WalletAppUserView.initViews();

}
createDatabase();

