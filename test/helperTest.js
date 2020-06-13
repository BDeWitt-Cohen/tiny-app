const { assert } = require('chai');

const { getUserByEmail } = require('../helpers.js');

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", users);
    const expectedOutput = "userRandomID";
    console.log("this user", user);
    assert.equal(expectedOutput, user);

  });
  it('should return undefined when no email is passed in', function() {
    const user = getUserByEmail("not@real.com", users);
    const expectedOutput = undefined;
    
    assert.equal(expectedOutput, user);

  });
});