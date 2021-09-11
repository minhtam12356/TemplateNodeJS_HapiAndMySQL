const Faker = require('faker');
const AppUser = require('../API/AppUsers/resourceAccess/AppUsersResourceAccess');
const BooksCategory = require('../API/BooksCategory/resourceAccess/BooksCategoryResourceAccess');
const Books = require('../API/Books/resourceAccess/BooksResourceAccess');
const { BOOK_STATUS, BOOK_VIEW_STATUS, BOOK_UPDATE_STATUS } = require('../API/Books/BookConstants');
const UtilFunctions = require('../API/ApiUtils/utilFunctions');


async function _seedBooks() {
  let booksCategories = await BooksCategory.find({});
  let bookList = [];
  console.log(`create books`);
  for (let i = 0; i < booksCategories.length; i++) {
    const category = booksCategories[i];
    let categories = [
      category.booksCategoryCode,
    ];

    if (i < booksCategories.length - 3) {
      categories.push(booksCategories[i + 2].booksCategoryCode);
    }

    if (i < booksCategories.length - 2) {
      categories.push(booksCategories[i + 1].booksCategoryCode);
    }

    let booksName = "Truyện " + Faker.company.companyName();
    let booksUrl = UtilFunctions.nonAccentVietnamese(booksName)
    booksUrl = UtilFunctions.convertToURLFormat(booksUrl);
    let dayViewed = UtilFunctions.randomInt(0, 9999) * (i % 7);

    bookList.push({
      booksName: booksName,
      booksRating: i % 5,
      booksCreators: Faker.name.findName(),
      booksStatus: BOOK_STATUS.ACTIVE,
      booksTotalChapter: i * 10,
      booksTotalViewed: dayViewed * 365,
      booksError: "",
      booksTagCloud: "tag truyện 1;tag truyện 2",
      booksCategories: categories.join(';'),
      booksViewedStatus: i % 7 === 0 ? BOOK_VIEW_STATUS.HOT : BOOK_VIEW_STATUS.NORMAL,
      booksUrl: booksUrl,
      booksAvatar: "http://st.imageinstant.net/data/comics/138/mot-doi-thanh-tien.jpg",
      dayViewed: dayViewed,
      monthViewed: dayViewed * 30,
      weekViewed: dayViewed * 7,
      searchCount: parseInt(dayViewed / 5),
      booksUpdateStatus: i % 13 === 0 ? BOOK_UPDATE_STATUS.COMPLETE : BOOK_UPDATE_STATUS.UPDATING
    });
  }

  let insertBookResult = await Books.insert(bookList);
  console.log(`init ${Books.modelName} ` + insertBookResult);
}
  for (let i = 0; i < users.length; i++) {
    const user = users[i];

  }
}

for (let i = 0; i < 10; i++) {

async function seedDatabase() {
  console.log("seedDatabase");
  await _seedBooks();
}

seedDatabase();


