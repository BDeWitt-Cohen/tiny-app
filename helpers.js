//returns longurls
const urlsForUser = function(urlDatabase, ID) {
  const filteredData = {};
console.log("stuff", urlDatabase, ID);
  for (const url in urlDatabase) {

    if (ID === urlDatabase[url].userID) {
      filteredData[url] = urlDatabase[url]

    }
  }

  return filteredData;
}

//Function to generate 6 character alpha-numeric string
function generateRandomString() {
  return Math.random().toString(36).substring(2, 8);
}




const testUsers = {
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
const getUserByEmail = function(email, database) {
  let final = '';
  for (const user in database){
   if (database[user].email === email){
    final = database[user].id;
   }
   
  }
  console.log(final);
  return final

  
};

const user = getUserByEmail("user@example.com", testUsers)

console.log(user);

module.exports = { urlsForUser, generateRandomString, getUserByEmail }