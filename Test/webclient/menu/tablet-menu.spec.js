const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

const mocha = require('mocha');
const describe = mocha.describe;
const should = require('chai').should();

const it = mocha.it;

const { token, merchantcode, baseUrl } = require('../../constants');
const { checkResponseStatus } = require('../../common');
chai.use(chaiHttp);

describe('Test chức năng menu trên tablet', function() {
  it('danh sách menu là loại dịch vụ', done => {
    let productType = 2;
    chai
      .request(`${baseUrl}`)
      .get(`/menus/menu-items-merchant?type=${productType}`)
      .set({
        Authorization: `Bearer ${token.owner.token}`,
      })
      .end((err, res) => {
        checkResponseStatus(res, 200);
        for (var i = 0; i < res.body.data.length; i++) {
          let menuCategory = res.body.data[i];
          for (var j = 0; j < menuCategory.menuItems.length; j++) {
            let menuItem = menuCategory.menuItems[j];
            for (var k = 0; k < menuItem.products.length; k++) {
              expect(menuItem.products[k].type).to.equal(productType);
            }
          }
        }
        done();
      });
  });
  it('danh sách menu là loại sản phẩm', done => {
    let productType = 1;
    chai
      .request(`${baseUrl}`)
      .get(`/menus/menu-items-merchant?type=${productType}`)
      .set({
        Authorization: `Bearer ${token.owner.token}`,
      })
      .end((err, res) => {
        checkResponseStatus(res, 200);
        for (var i = 0; i < res.body.data.length; i++) {
          let menuCategory = res.body.data[i];
          for (var j = 0; j < menuCategory.menuItems.length; j++) {
            let menuItem = menuCategory.menuItems[j];
            for (var k = 0; k < menuItem.products.length; k++) {
              expect(menuItem.products[k].type).to.equal(productType);
            }
          }
        }
        done();
      });
  });
  it('danh sách menu theo tên', done => {
    const searchText = 'COMBO';
    chai
      .request(`${baseUrl}`)
      .get(`/menus/menu-items-merchant?searchText=${searchText}`)
      .set({
        Authorization: `Bearer ${token.owner.token}`,
      })
      .end((err, res) => {
        checkResponseStatus(res, 200);
        for (var i = 0; i < res.body.data.length; i++) {
          let menuCategory = res.body.data[i];
          for (var j = 0; j < menuCategory.menuItems.length; j++) {
            let menuItem = menuCategory.menuItems[j];
            for (var k = 0; k < menuItem.products.length; k++) {
              expect(menuItem.name.toLowerCase().includes(searchText.toLowerCase())).to.equal(true);
            }
          }
        }
        done();
      });
  });
});
