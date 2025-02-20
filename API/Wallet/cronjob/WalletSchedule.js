const {CronInstance, executeJob} = require("../../ThirdParty/Cronjob/CronInstance");

const syncETHScheduler = () => {
  //Sync every 5 minutes, hope it go well
  CronInstance.schedule('*/5 * * * *', async function() {
    executeJob('./Wallet/cronjob/Jobs_SyncETHBalance.js');
  });
};

async function startSchedule(){
  console.log("start WalletSchedule");
  if(process.env.NODE_ENV === 'Test'){
    return;
  }
  syncETHScheduler();
}

module.exports = {
  startSchedule,
};
