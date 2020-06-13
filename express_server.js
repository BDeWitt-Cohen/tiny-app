const express = require("express");
const app = express(); //express package for the server
const PORT = 3001; // default port 8080 doesn't seem to work on my setup
const bodyParser = require("body-parser"); //body parser package
const morgan = require('morgan'); //logger middleware
const bcrypt = require('bcrypt'); //password hasher
const cookieSession = require('cookie-session'); //cookie-encryption
const { urlsForUser, generateRandomString } = require('./helpers'); //bringing in helper functions



app.use(bodyParser.urlencoded({ extended: true })); //setting bodyParser params
app.set('view engine', 'ejs'); //setting viewing engine to read ejs
app.use(morgan('tiny')); //setting morgan logger params
app.use(cookieSession({
  name: 'session',
  keys: [
    'salfkvlsdkvnslvnsvlknsdv',
    'sknalcknfcslkkcvlknmdsclvkmsdvlksdvlk'
  ],

  maxAge: 24 * 60 * 60 * 1000 // 24 hours
})); //setting cookie-session params





//Hardcoded URL database - looping through this on the index page
const urlDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: "batman" },
  "sdmkfj": { longURL: "http://www.google.com", userID: "batman" }
};

//Users and details for each. These passwords are not hashed and will therefore fail
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
};


//**********GET requests **********//


//Root path, redirects to register page
app.get("/", (req, res) => {
  res.redirect('/register');
});

//Renders the index page and moves templateVars over to index page
app.get("/urls", (req, res) => {
  const justID = req.session.userid;

  if (req.session.userid) {
    const urlList = urlsForUser(urlDatabase, justID);

    let templateVars = {
      user: users[req.session.userid],
      urls: urlList,
      // urlDatabase
    };
;
    res.render("urls_index", templateVars);
    return;
  }

  res.redirect("/login");
  return;
});

//Sending templateVars to urls_new
app.get("/urls/new", (req, res) => {
  let longURL = req.params.longURL;

  if (!req.session.userid) {
    res.redirect('/login');
    return;
  }

  let templateVars = {
    user: users[req.session.userid],
    longURL,
    urlDatabase
  };

  res.render("urls_new", templateVars);
});

//Renders the registration page and passes templateVars to user_registration
app.get('/register', (req, res) => {
  if (req.session.userid) {
    res.redirect('/urls');
  }
  
  let templateVars = {
    urls: urlDatabase,
    user: ""
  };
  res.render('user_registration', templateVars);
});

//Renders login page, if already logged in redirects to /urls
app.get('/login', (req, res) => {
  if (req.session.userid) {
    res.redirect('/urls');
  }
  
  let templateVars = {
    urls: urlDatabase,
    user: "" || req.session.userid
  };

  res.render('user_login', templateVars);
  return;
});

//Error if longURL isn't valid or shortURL doesn't exist otherwise takes them to their longURL
app.get("/u/:shortURL", (req, res) => {
  let newShort = req.params.shortURL;

  for (const urls in urlDatabase) {
    if (urls !== newShort) {
      res.send('Sorry, that shortURL doesn\'t exits!');
    }
  }

  const longURL = urlDatabase[req.params.shortURL].longURL;
  if (longURL === undefined) {
    res.send("The webpage your originally converted doesn't exist. Maybe try to google it or something...");

  }

  res.redirect(longURL);
  return;
});

//Goes to the show page where they can edit or use their link
app.get("/urls/:shortURL", (req, res) => {
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
    user: users[req.session.userid]
  };

  res.render("urls_show", templateVars);
});


//**********POST requests **********//


//Updates the URL database with new shortened URL
app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  let temp = { longURL: req.body.longURL, userID: req.session.userid };
  urlDatabase[shortURL] = temp;

  res.redirect(`/urls/${shortURL}`);
  return;
});

//Setting cookies name and passing it to /urls then redirecting to /urls
app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  for (const userId in users) {

    if (users[userId].email === email) {
      const result = bcrypt.compareSync(password, users[userId].hashedPassword);

      if (result) {
        req.session.userid = "userid";
        res.redirect('/urls');
        return;
      }
    }
  }

  res.status(403);
  res.send("there is an error with your sign-in credentials");
});

//Clearing cookies and redirecting back to /urls
app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect("/login");
});

//Register new user, and set cookie, if user exists send an error back
app.post('/register', (req, res) => {
  const id = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = {
    id,
    email,
    hashedPassword
  };

  if (!email || !password) {
    res.status(400);
    res.send("this thing dun did broke");
  }

  for (const userId in users) {

    if (users[userId].email === email) {
      res.status(400);
      return res.send("there is a problem, that email already exists");
    }
  }

  users[id] = newUser;
  req.session.userid = id;
  return res.redirect('/urls');
});

//Setting longURL to the proper shortURL then back to /urls
app.post('/urls/:shortURL/edit', (req, res) => {
  let shortURL = req.params.shortURL;
  const fullObject = urlDatabase[shortURL];

  if (!fullObject) {
    res.status(301).send("this url doesn't exist, fix this later");
    return;
  }

  if (req.session.userid === fullObject.userID) {
    let longURL = req.body.longURL;
    let userID = fullObject.userID;

    urlDatabase[shortURL] = { longURL, userID };

    res.redirect('/urls');
    return;
  }

  res.send("you don't have access to this url");
});

//Removing a short/long URL from the database then back to /urls
app.post('/urls/:shortURL/delete', (req, res) => {
  let shortURL = req.params.shortURL;
  const fullObject = urlDatabase[shortURL];

  if (!fullObject) {
    res.status(301);
    res.send("this url doesn't exist, please go back");
    return;
  }
  if (req.session.userid === fullObject.userID) {

    delete urlDatabase[req.params.shortURL];
    res.redirect('/urls');
    return;
  }

  res.send("you don't have access to this url");
});




//Just a listener to ensure server is running. A bit redundant with nodemon installed.
app.listen(PORT, () => {
  console.log(`Your port is "${PORT}" and it's 🔥🔥🔥!`);
});
