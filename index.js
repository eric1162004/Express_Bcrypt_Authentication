const express = require("express");
const app = express();
const bcrypt = require("bcrypt");

// store users in memory
const users = [];

// parse json request body
app.use(express.json());

// get all stored users
app.get("/users", (req, res) => {
  res.json(users);
});

// register a user
app.post("/users", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = {
      name: req.body.name,
      password: hashedPassword,
    };
    users.push(user);

    res.status(201).send("added user");
  } catch (err) {
    res.status(500).send();
  }
});

// authenticate a user
app.post("/users/login", async (req, res) => {
  // check user exist
  const user = users.find((user) => user.name === req.body.name);

  if (user) {
    // compare the password given by the client and the hashed password in the server
    // bcrypt.compare(PLAIN_PASSWORD, ENCRYPTED_PASSWORD)
    if (await bcrypt.compare(req.body.password, user.password)) {
      res.send("Success!");
    } else {
      res.send("Not authenticated");
    }
  } else {
    res.status(400).send("Cannot find user");
  }
});

app.listen(3000);
