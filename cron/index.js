/**
 * Created by A on 7/18/17.
 */
'use strict';

const { CronInstance, executeJob } = require("../ThirdParty/Cronjob/CronInstance");
const Logger = require('../utils/logging');
const CustomerMessageJob = require('../API/CustomerMessage/cronjob/StationsMessageAutoSend');

async function startSchedule() {
  Logger.info("startSchedule ", new Date());

  //do not run schedule on DEV environments
  if (process.env.NODE_ENV === 'dev') {
    return;
  }

  //every 30 seconds
  setInterval(CustomerMessageJob.autoSendMessageForCustomer, 30 * 1000);

  //every 1 minutes
  CronInstance.schedule('* * * * *', async function () {
    executeJob('./cron/crawlerChapterDetail.js');
  });

}

module.exports = {
  startSchedule,
};
