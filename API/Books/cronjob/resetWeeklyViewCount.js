const BooksResourceAccess = require('../resourceAccess/BooksResourceAccess');
const Logger = require('../../../utils/logging');

async function resetWeeklyCount() {
  let result = await BooksResourceAccess.resetWeekViewedCount();
  Logger.info(__filename, " result : " + result);
}

resetWeeklyCount();