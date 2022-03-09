'use strict';
const bcrypt = require("bcrypt");
const middleware = require('../src/auth/middleware/basic.js');
const { db, Users } = require('../src/models/index.js');

let userInfo = {
  admin: { username: 'admin', password: ('password') },
};

// Pre-load our database with fake users


describe('Auth Middleware', () => {
  beforeAll(async () => {
    await db.sync();
    userInfo.admin.password = await bcrypt.hash(userInfo.admin.password,5)
    await Users.create(userInfo.admin);
  });
  afterAll(async () => {
    await db.drop();
  })
  // admin:password: YWRtaW46cGFzc3dvcmQ=
  // admin:foo: YWRtaW46Zm9v

  // Mock the express req/res/next that we need for each middleware call
  const req = {};
  const res = {
    status: jest.fn(() => res),
    send: jest.fn(() => res)
  }
  const next = jest.fn();

  describe('user authentication', () => {

    it('fails a login for a user (admin) with the incorrect basic credentials', () => {

      // Change the request to match this test case
      req.headers = {
        authorization: 'Basic YWRtaW46Zm9v',
      };

      return middleware(req, res, next)
        .then(() => {
          expect(next).not.toHaveBeenCalled();
          expect(res.status).toHaveBeenCalledWith(403);
        });

    }); // it()

    it('logs in an admin user with the right credentials', () => {

      // Change the request to match this test case
      req.headers = {
        authorization: 'Basic YWRtaW46cGFzc3dvcmQ=',
      };

      return middleware(req, res, next)
        .then(() => {
          expect(next).toHaveBeenCalled();
        });

    }); // it()

  });

});