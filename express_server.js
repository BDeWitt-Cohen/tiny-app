const express = require("express");
const app = express();
const PORT = 3001; // default port 8080

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
//set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

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
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.post("/urls", (req, res) => {
  // console.log(req.body);
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  console.log(urlDatabase); //logs the object with the newly added kvp (key:value pair)
  res.redirect(`/urls/${shortURL}`);
  return;
  // res.send("We're working on figuring this out, hold on for like an hour or two");         // Respond with 'Ok' (we will replace this)
});

app.post('/urls/:shortURL/delete', (req, res) => {
  console.log(urlDatabase[req.params.shortURL]);
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
})


app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
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