const express = require("express");
const app = express(); //express package for the server
const PORT = 3001; // default port 8080 doesn't seem to work on my setup
const cookieParser = require('cookie-parser') //cookie parser package
const bodyParser = require("body-parser"); //body parser package

app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs'); //setting viewing engine to read ejs

//Function to generate 6 character alpha-numeric string
function generateRandomString() {
  return Math.random().toString(36).substring(2, 8);
}

//URL database - looping through this on the index page
const urlDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: "batman" },
  "sdmkfj": { longURL: "http://www.google.com", userID: "batman" }
};

//Users and details for each. Likely need to loop through at some point
const users = {
  "tthomas": {
    id: "tthomas",
    email: "tthomas@me.com",
    password: "wouldyoukindly"
  },
  "batman": {
    id: "batman",
    email: "bat@man.com",
    password: "gotham"
  }
}

//Root path, just displays hello, will want to change this at some point, maybe a redirect to /URLs
app.get("/", (req, res) => {
  res.send("Hello!");
});

//Displays all of the URLs in the database as JSON - likely not needed anymore
app.get("/urls.json", (req, res) => {

  res.json(urlDatabase);
});

//Renders the index page and moves templateVars over to index page
app.get("/urls", (req, res) => {
  // {longURL: req.body.longURL, userID: req.cookies["user_id"]};
  if (req.cookies["user_id"]) {
    let templateVars = {
      urls: urlDatabase,
      user: users[req.cookies["user_id"]]
    };
    res.render("urls_index", templateVars);
    return;
  }
  res.redirect("/login")
});

//Sending templateVars to urls_new
app.get("/urls/new", (req, res) => {
let longURL = req.params.longURL
console.log("this is the long url", longURL);
  if (!req.cookies["user_id"]) {
    res.redirect('/login')
    return
  }
  let templateVars = {
    user: users[req.cookies["user_id"]],
    longURL
  }
  console.log("whats this", req.params.longURL);
  // console.log(urlDatabase);
  res.render("urls_new", templateVars);
});

//Still in progress, renders the registration page and passes templateVars to user_registration
app.get('/register', (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    user: ""
  };
  res.render('user_registration', templateVars)
})

app.get('/login', (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    user: ""
  };
  res.render('user_login', templateVars)
})

//Error code if the webpage isn't valid, otherwise redirects to the longURL
app.get("/u/:shortURL", (req, res) => {

  const longURL = urlDatabase[req.params.shortURL].longURL;
  console.log(longURL);
  if (longURL === undefined) {
    res.send("The webpage your originally converted doesn't exist. Maybe try to google it or something...");

  }
  res.redirect(longURL);
  return;
});


app.get("/urls/:shortURL", (req, res) => {
  console.log("shorturl in urls/shorturl",req.params.shortURL);
  console.log("longURL in ursl/shortURL", urlDatabase[req.params.shortURL]);
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
    user: users[req.cookies["user_id"]]
  };
  res.render("urls_show", templateVars);
});

//Just displays Hello World on the /hello page. Can probably get rid of this at some point.
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});



//Updates the URL database with new shortened URL
app.post("/urls", (req, res) => {
  // "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: "batman" }
  let shortURL = generateRandomString();

  let temp = {longURL: req.body.longURL, userID: req.cookies["user_id"]};

  //urlDatabase[shortURL].longURL = req.body.longURL;
  urlDatabase[shortURL] = temp;
  res.redirect(`/urls/${shortURL}`);
  return;
});

//Setting cookies name and passing it to /urls then redirecting to /urls
app.post('/login', (req, res) => {
  const email = req.body.email
  const password = req.body.password

  for (const userId in users) {
    // console.log(users[userId]);
    // console.log(email);
    if (users[userId].email === email && users[userId].password === password) {

      res.cookie('user_id', userId)
      res.redirect('/urls')
      return
    }
  }
  res.status(403)
  res.send("there is an error with your sign-in credentials")

})

//Clearing cookies and redirecting back to /urls
app.post('/logout', (req, res) => {
  res.clearCookie("user_id")
  res.redirect("/urls")
})

//Register new user, set and set cookie, if user exists send an error back
app.post('/register', (req, res) => {
  const id = generateRandomString()
  const email = req.body.email
  const password = req.body.password
  const newUser = {
    id,
    email,
    password
  }

  if (!email || !password) {
    res.status(400)
    res.send("this thing dun did broke")
  }

  for (const userId in users) {
    console.log(users[userId]);
    if (users[userId].email === email) {

      res.status(400)
      return res.send("there is a problem")
    }
  }
  users[id] = newUser
  res.cookie('user_id', id)
  return res.redirect('/urls')

})

//Setting longURL to the proper shortURL then back to /urls
app.post('/urls/:shortURL/edit', (req, res) => {
  let shortURL = req.params.shortURL
  urlDatabase[shortURL] = req.body.longURL
  res.redirect('/urls')
})

//Removing a short/long URL from the database then back to /urls
app.post('/urls/:shortURL/delete', (req, res) => {
  console.log(urlDatabase[req.params.shortURL]);
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
})




//Just a listener to ensure server is running. A bit redundant with nodemon installed.
app.listen(PORT, () => {
  console.log(`Yo, your port is "${PORT}" and it's 🔥🔥🔥!`);
});



// const foundUser = function() {
//   let user = req.cookies["user_id"]
//   let foundUser;
//   for (const userId in users) {
//     if (user.email === email) {
//       return true
//       foundUser = users[userId];
//     }
//   }
// }