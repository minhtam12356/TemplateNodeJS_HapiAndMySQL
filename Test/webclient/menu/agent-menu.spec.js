const _ = require('lodash');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { checkResponseStatus } = require('../../common');
const faker = require('faker');
chai.should();
chai.use(chaiHttp);

const { token, envData, baseUrl } = require('../../constants');

describe('Test dịch vụ', function() {
  this.timeout(5000);
  const name = `test service ${faker.commerce.productName()}`;
  const description = `description ${faker.commerce.productAdjective()}`;
  let categoryId, menuItemId;

  before(done => {
    chai
      .request(baseUrl)
      .get(`/menus/menu-items?restaurantId=${envData.restaurant.id}`)
      .set({ Authorization: `Bearer ${token.owner.token}`, 'Content-Type': 'application/json' })
      .end((err, res) => {
        checkResponseStatus(res, 200);
        categoryId = res.body.data.find(menu => menu.categoryName == 'Danh sách dịch vụ').categoryId;
        categoryId.should.be.a('Number');
        done();
      });
  });

  it('Tạo mới dịch vụ', done => {
    const body = {
      name,
      description,
      price: 20000,
      discountPrice: 18000,
      categoryId,
      photo: '',
      applyAllRestaurants: true,
      type: 2,
    };
    chai
      .request(baseUrl)
      .post('/menus/menu-item-product')
      .set({ Authorization: `Bearer ${token.owner.token}`, 'Content-Type': 'application/json' })
      .send(body)
      .end((err, res) => {
        checkResponseStatus(res, 200);
        done();
      });
  });
  it('Check dịch vụ mới tạo trong menu', done => {
    chai
      .request(baseUrl)
      .get(`/menus/menu-items-merchant?searchText=${name}`)
      .set({ Authorization: `Bearer ${token.owner.token}`, 'Content-Type': 'application/json' })
      .end((err, res) => {
        checkResponseStatus(res, 200);
        const data = res.body.data;
        menuItemId = data.map(menu =>
          menu.menuItems.filter(menuItem => menuItem.name == name && menuItem.description == description)
        );
        menuItemId = _.flatten(menuItemId).map(menuItem => menuItem.id)[0];
        menuItemId.should.be.a('number');
        done();
      });
  });

  it('Delete menu dịch vụ test', done => {
    menuItemId.should.be.a('number');
    chai
      .request(baseUrl)
      .delete(`/menus/menu-item/${menuItemId}`)
      .set({ Authorization: `Bearer ${token.owner.token}`, 'Content-Type': 'application/json' })
      .end((err, res) => {
        checkResponseStatus(res, 200);
        done();
      });
  });
});
