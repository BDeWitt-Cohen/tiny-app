const express = require("express");
const app = express();
const PORT = 3001; // default port 8080
const cookieParser = require('cookie-parser')
const bodyParser = require("body-parser");

app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

function generateRandomString() {
  return Math.random().toString(36).substring(2, 8);
}

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    username: req.cookies["username"]
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  let templateVars = {
    username: req.cookies["username"]
  }
  res.render("urls_new", templateVars);
});

app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  console.log(urlDatabase);//logs the object with the newly added kvp (key:value pair)
  res.redirect(`/urls/${shortURL}`);
  return;

});

app.post('/login', (req, res) => {
  res.cookie('username', req.body.username)
  let templateVars = {
    username: req.cookies["username"],
    urls: urlDatabase
  };

  
  // console.log("this is",templateVars.username);
  //   console.log('Username is: ', req.body.username)
  res.redirect('/urls')
})

app.post('/logout', (req, res) => {
res.clearCookie("username")
  res.redirect("/urls")
})

app.post('/urls/:shortURL/edit', (req, res) => {
  let shortURL = req.params.shortURL
  urlDatabase[shortURL] = req.body.longURL
  res.redirect('/urls')
})


app.post('/urls/:shortURL/delete', (req, res) => {
  console.log(urlDatabase[req.params.shortURL]);
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
})

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { 
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL],
    username: req.cookies["username"] };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {

  const longURL = urlDatabase[shortURL];
  console.log(longURL);
  if (longURL === undefined) {
    res.send("The webpage your originally converted doesn't exist. Maybe try to google it or something...");

  }
  res.redirect(longURL);
  return;
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});



app.listen(PORT, () => {
  console.log(`Yo, your port is like: ${PORT}!`);
});

console.log(`${PORT} is the 🔥  port`);






// if(longURL === undefined){
//   console.log("helloaskjaf s");
//   res.send("The webpage your originally converted doesn't exist. Maybe ttry to google it or something...")
//   return;
// } else {
// res.redirect(longURL)

// return;}