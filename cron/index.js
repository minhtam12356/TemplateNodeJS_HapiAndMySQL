/**
 * Created by A on 7/18/17.
 */
'use strict';

const { CronInstance, executeJob } = require("../ThirdParty/Cronjob/CronInstance");
const Logger = require('../utils/logging');
async function startSchedule() {
  Logger.info("startSchedule ", new Date());

  //do not run schedule on DEV environments
  if (process.env.ENV === 'dev') {
    return;
  }

  // every 5 minutes
  CronInstance.schedule('*/5 * * * *', async function () {
    executeJob('./cron/crawlerHomePageBooks.js');
  });

  // every 5 minutes
  CronInstance.schedule('*/5 * * * *', async function () {
    executeJob('./cron/crawlerBookDetail.js');
  });

  //every 1 minutes
  CronInstance.schedule('* * * * *', async function () {
    executeJob('./cron/crawlerChapterDetail.js');
  });

  //every 1 minutes
  CronInstance.schedule('* * * * *', async function () {
    executeJob('./cron/crawlerOldChapterDetail.js');
  });
  
  //everyday
  CronInstance.schedule('0 1 * * *', async function () {
    executeJob('./Books/cronjob/resetDailyViewCount.js');
  });

  //every first day of month
  CronInstance.schedule('0 1 1 * *', async function () {
    executeJob('./Books/cronjob/resetMonthlyViewCount.js');
  });

  //every first day of week
  CronInstance.schedule('0 1 * * 1', async function () {
    executeJob('./Books/cronjob/resetWeeklyViewCount.js');
  });
}

module.exports = {
  startSchedule,
};
