const faker = require('faker');
const chai = require('chai');
const chaiHttp = require('chai-http');
const fs = require('fs');

const { checkResponseStatus } = require('../../Common/test/Common');

chai.should();
chai.use(chaiHttp);
chai.use(chaiHttp);

const Model = require('../resourceAccess/AppUsersResourceAccess');

const app = require('../../../server');

describe(`Tests ${Model.modelName}`, function() {
  let token = "";
  let fakeUserName = faker.name.firstName() + faker.name.lastName();
  before(done => {
    new Promise(async function(resolve, reject) {
      resolve();
    }).then(() => done());
  });

  it('Register user', done => {
    const body = {
      "lastName": "string",
      "firstName": "string",
      "username": fakeUserName,
      "email": faker.internet.email(),
      "password": "string",
      "phoneNumber": "string"
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/AppUsers/registerUser`)
      .send(body)
      .end((err, res) => {
        if ( err ) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        token = 'Bearer ' + res.body.data.token;
        done();
      });
  });

  it('Login app user', done => {
    const body = {
      "username": fakeUserName,
      "password": "string",
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/AppUsers/loginUser`)
      .send(body)
      .end((err, res) => {
        if ( err ) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it('Login facebook', done => {
    const body = {
      facebook_id: faker.finance.creditCardNumber(),
      facebook_avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Facebook-icon-1.png/600px-Facebook-icon-1.png",
      facebook_name: faker.name.firstName(),
      facebook_email: faker.internet.email(),
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/AppUsers/loginFacebook`)
      .send(body)
      .end((err, res) => {
        if ( err ) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it('Login Google', done => {
    const body = {
      google_id: faker.finance.creditCardNumber(),
      google_avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/368px-Google_2015_logo.svg.png",
      google_name: faker.name.firstName(),
      google_email: faker.internet.email(),
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/AppUsers/loginGoogle`)
      .send(body)
      .end((err, res) => {
        if ( err ) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it('Login Zalo', done => {
    const body = {
      zalo_id: faker.finance.creditCardNumber(),
      zalo_avatar: "https://upload.wikimedia.org/wikipedia/commons/6/6c/Logo_zalo.png",
      zalo_name: faker.name.firstName(),
      zalo_email: faker.internet.email(),
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/AppUsers/loginZalo`)
      .send(body)
      .end((err, res) => {
        if ( err ) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });

  it('Login Apple', done => {
    const body = {
      apple_id: faker.finance.creditCardNumber(),
      apple_avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/505px-Apple_logo_black.svg.png",
      apple_name: faker.name.firstName(),
      apple_email: faker.internet.email(),
    };
    chai
      .request(`0.0.0.0:${process.env.PORT}`)
      .post(`/AppUsers/loginApple`)
      .send(body)
      .end((err, res) => {
        if ( err ) {
          console.error(err);
        }
        checkResponseStatus(res, 200);
        done();
      });
  });
  it('Upload user avatar', done => {
    fs.readFile('uploads/sampleAvatar.jpg', function read(err, data) {
      if (err) {
        return null;
      }

      var base64data = Buffer.from(data, 'binary').toString('base64');
      const body = {
        image: base64data,
        imageFormat: "jpg",
      };
      chai
        .request(`0.0.0.0:${process.env.PORT}`)
        .post(`/Upload/uploadUserAvatar`)
        .set('Authorization', token)
        .send(body)
        .end((err, res) => {
          if ( err ) {
            console.error(err);
          }
          checkResponseStatus(res, 200);
          done();
        });
    });
  });
});
