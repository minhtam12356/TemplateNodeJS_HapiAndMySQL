const Staff = require('../Staff/resourceAccess/StaffResourceAccess');
// const ETHWallet = require('../ETHWallet/resourceAccess/ETHWalletResourceAccess');
const BetRecords = require('../BetRecords/resourceAccess/BetRecordsResourceAccess');
const DepositTransaction = require('../DepositTransaction/resourceAccess/DepositTransactionResourceAccess');
const Role = require('../Role/resourceAccess/RoleResourceAccess');
const User = require('../User/resourceAccess/UserResourceAccess');
const UserCommision = require('../Commission/resourceAccess/UserCommisionResourceAccess');
const Wallet = require('../Wallet/resourceAccess/WalletResourceAccess');
const WithdrawTransaction = require('../WithdrawTransaction/resourceAccess/WithdrawTransactionResourceAccess');
const ExchangeTransaction = require('../ExchangeTransaction/resourceAccess/ExchangeTransactionResourceAccess');
const {DEPOSIT_TRX_STATUS} = require('../DepositTransaction/DepositTransactionConstant');
const {WITHDRAW_TRX_STATUS} = require('../WithdrawTransaction/WithdrawTransactionConstant');
const {EXCHANGE_TRX_STATUS} = require('../ExchangeTransaction/ExchangeTransactionConstant');

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


