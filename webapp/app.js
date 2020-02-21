const express = require("express");
const fs = require("fs");

const app = express();
const jsonParser = express.json();

app.use(express.static(__dirname + "/public"));

app.get("/api/users", function (req, res) {

  let content = fs.readFileSync("users.json", "utf8");
  let users = JSON.parse(content);
  res.send(users);
});

app.get("/api/users/:id", function(req, res) {

  let id = req.params.id;
  let content = fs.readFileSync("users.json", "utf8");
  let users = JSON.parse(content);
  let user;

  for (let i = 0; i < users.length; i++) {
    if (users[i].id == id) {
      user = users[i];
      break;
    }
  }

  if (user) {
    res.send(user);
  } else {
    res.status(404).send("User isn't found");
  }

});

app.post("/api/users", jsonParser, function (req, res) {
  
  if (!req.body) res.sendStatus(400);

  let userName = req.body.name;
  let userAge = req.body.age;
  let user = {name: userName, age: userAge};

  let data = fs.readFileSync("users.json", "utf8");
  let users = JSON.parse(data);

  let id = Math.max(...users.map((user) => user.id));
  
  if (Number.isFinite(id)) {
    user.id = id + 1;
  } else {
    user.id = 1;
  }
  
  users.push(user);

  data = JSON.stringify(users);
  fs.writeFileSync("users.json", data);
  res.send(user);
});

app.delete("/api/users/:id", function (req, res) {

  let id = req.params.id;
  let data = fs.readFileSync("users.json", "utf8");
  let users = JSON.parse(data);
  let index = -1;

  for (let i = 0; i < users.length; i++) {
    if (users[i].id == id) {
      index = i;
      break;
    }
  }

  if (index > -1) {
    let user = users.splice(index, 1)[0];
    
    for (let i = 0; i < users.length; i++) {
      users[i].id = i + 1;
    }
    
    let data = JSON.stringify(users);
    fs.writeFileSync("users.json", data);
    res.send(user);
  } 
  else {
    res.status(404).send("User isn't found by ID");
  }
});

app.put("/api/users", jsonParser, function (req, res) {

  if (!req.body) res.status(400).send("Failed to change");
  
  let userId = req.body.id;
  let userName = req.body.name;
  let userAge = req.body.age;

  let data = fs.readFileSync("users.json", "utf8");
  let users = JSON.parse(data);
  let user;

  for (let i = 0; i < users.length; i++) {
    if (users[i].id == userId) {
      user = users[i];
      break;
    }
  }

  if (user) {
    user.age = userAge;
    user.name = userName;
    let data = JSON.stringify(users);
    fs.writeFileSync("users.json", data);
    res.send(user);
  } 
  else {
    res.status(404).send(user);
  }
});

app.listen(3000, function() {
  console.log("Server started");
});

