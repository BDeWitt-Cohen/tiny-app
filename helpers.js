//returns longurls
const urlsForUser = function(urlDatabase, ID) {
  const filteredData = {};

  for (const url in urlDatabase) {

    if (ID === urlDatabase[url].userID) {
      filteredData[url] = urlDatabase[url];

    }
  }

  return filteredData;
};

//Function to generate 6 character alpha-numeric string
const generateRandomString = function() {
  return Math.random().toString(36).substring(2, 8);
};

//Function to find users by their email and return that user
const getUserByEmail = function(email, database) {

  for (const user in database) {

    if (database[user].email === email) {
      return database[user].id;

    }
  }

  return undefined;
};



module.exports = { urlsForUser, generateRandomString, getUserByEmail };