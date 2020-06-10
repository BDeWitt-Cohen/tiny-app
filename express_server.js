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
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
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

//Displays all of the URLs in the database
app.get("/urls.json", (req, res) => {
  
  res.json(urlDatabase);
});

//Renders the index page and moves templateVars over to index page
app.get("/urls", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    username: req.cookies["username"]
  };
  res.render("urls_index", templateVars);
});

//Sending templateVars to urls_new
app.get("/urls/new", (req, res) => {
  let templateVars = {
    username: req.cookies["username"]
  }
  res.render("urls_new", templateVars);
});

//Updates the URL database with new shortened URL
app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
  return;
});

//Setting cookies name and passing it to /urls then redirecting to /urls
app.post('/login', (req, res) => {
  res.cookie('username', req.body.username)
  let templateVars = {
    username: req.cookies["username"],
    urls: urlDatabase
  };
  res.redirect('/urls')
})

//Clearing cookies and redirecting back to /urls
app.post('/logout', (req, res) => {
  res.clearCookie("username")
  res.redirect("/urls")
})




//Still in progress, renders the registration page and passes templateVars to user_registration
app.get('/register', (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    username: req.cookies["username"]
  };
  res.render('user_registration', templateVars)
})





app.post('/register', (req, res) => {
//needs to add new user to user object
//will need to set a cookie with the user_id
//will then redirect to /urls, that will be the last step
//need to make sure that the user data is being passed in properly
//password will equal req.body.password and email with be req.body.email
let id = generateRandomString()
let email = req.body.email
let password = req.body.password
 users[id] = {
    id, 
    email, 
    password
  }
  console.log(users);
  res.cookie('user_ID', id)

  res.redirect('/urls')
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


app.get("/urls/:shortURL", (req, res) => {
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    username: req.cookies["username"]
  };
  res.render("urls_show", templateVars);
});

//Error code if the webpage isn't valid, otherwise redirects to the longURL
app.get("/u/:shortURL", (req, res) => {

  const longURL = urlDatabase[shortURL];
  console.log(longURL);
  if (longURL === undefined) {
    res.send("The webpage your originally converted doesn't exist. Maybe try to google it or something...");

  }
  res.redirect(longURL);
  return;
});

//Just displays Hello World on the /hello page. Can probably get rid of this at some point.
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});


//Just a listener to ensure server is running. A bit redundant with nodemon installed.
app.listen(PORT, () => {
  console.log(`Yo, your port is "${PORT}" and it's 🔥🔥🔥!`);
});
