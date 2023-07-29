const express = require("express");
const fs = require("fs");
const app = express();
var session = require("express-session");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "vinu",
    resave: false,
    saveUninitialized: true,
  })
);
app.get("/index", (req, res) => {
  if (!req.session.isLoggedIn) {
    res.redirect("/login");
    return;
  }
  res.sendFile(__dirname + "/public/index.html");
});
app.get("/", (req, res) => {
  if (!req.session.isLoggedIn) {
    res.redirect("/login");
    return;
  } else {
    res.sendFile(__dirname + "/public/home.html");
  }
});
app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/public/login.html");
});
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  fs.readFile("./users.json", "utf-8", (err, data) => {
    if (err) {
      console.log(err);
    } else {
      if (data == "") {
        res.send("Invalid password or email");
      }
      try {
        data = JSON.parse(data);
        data.filter((user) => {
          if (user.email == email && user.password == password) {
            req.session.isLoggedIn = true;
            req.session.email = email;
            res.redirect("/index");
          }
        });
        res.send("Invalid password or email");
      } catch (err) {
        console.log(err);
      }
    }
  });
});
app.get("/signup", (req, res) => {
  res.sendFile(__dirname + "/public/signup.html");
});
app.post("/signup", (req, res) => {
  const password = req.body.password;
  const email = req.body.email;
  fs.readFile("./users.json", "utf-8", (err, data) => {
    if (err) {
      console.log(err);
    } else {
      if (data == "") {
        data = "[]";
      }
      try {
        data = JSON.parse(data);
        data.filter((user) => {
          if (user.password == password || user.email == email) {
            res.send("Invalid password or email");
          }
        });
        data.push({ password: password, email: email });
        fs.writeFile("./users.json", JSON.stringify(data), (err) => {
          if (err) {
            res.send(err);
          } else {
            res.redirect("/login");
          }
        });
      } catch (err) {
        console.log(err);
      }
    }
  });
});
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});
app.get("/about", (req, res) => {
  if (!req.session.isLoggedIn) {
    res.redirect("/login");
    return;
  }
  res.sendFile(__dirname + "/public/about.html");
});
app.get("/contact", (req, res) => {
  if (!req.session.isLoggedIn) {
    res.redirect("/login");
    return;
  }
  res.sendFile(__dirname + "/public/contact.html");
});
app.get("/script.js", (req, res) => {
  res.sendFile(__dirname + "/public/script.js");
});
app.get("/getUser", (req, res) => {
  if (!req.session.isLoggedIn) {
    res.status(401).send();
    return;
  }
  email = req.session.email;
  res.send(email);
});
app.get("/readTask", (req, res) => {
  if (!req.session.isLoggedIn) {
    res.status(401).send();
    return;
  }
  fs.readFile("./tasks.txt", "utf-8", (err, data) => {
    if (err) {
      res.send(err);
    } else {
      if (data == "") {
        res.send("noting to show");
      }
      try {
        data = JSON.parse(data);
        res.send(data);
      } catch (err) {
        console.log(err);
      }
    }
  });
});
app.delete("/deleteTask", (req, res) => {
  if (!req.session.isLoggedIn) {
    res.status(401).send("Unauthorized");
    return;
  }
  res.sendFile(__dirname + "/public/about.html");
  task = req.body;
  fs.readFile("./tasks.txt", "utf-8", (err, data) => {
    if (err) {
      res.send(err);
    } else {
      if (data == "") {
        res.send("noting to show");
      }
      try {
        data = JSON.parse(data);
        data = data.filter((task) => {
          return task.task != req.body.task;
        });
        fs.writeFile("./tasks.txt", JSON.stringify(data), (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log("File written successfully\n");
          }
        });
      } catch (err) {
        console.log(err);
      }
    }
  });
  res.send("Task deleted successfully");
});

app.post("/writeTask", (req, res) => {
  if (!req.session.isLoggedIn) {
    res.status(401).send("Unauthorized");
    return;
  }
  task = req.body;
  fs.readFile("./tasks.txt", "utf-8", (err, data) => {
    if (err) {
      res.send(err);
    } else {
      if (data == "") {
        data = "[]";
      }

      try {
        data = JSON.parse(data);
        data.push(task);
        fs.writeFile("./tasks.txt", JSON.stringify(data), (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log("File written successfully\n");
          }
        });
      } catch (err) {
        console.log(err);
      }
    }
    res.send("Task added successfully");
  });
});

app.put("/updateTask", (req, res) => {
  if (!req.session.isLoggedIn) {
    res.status(401).send("Unauthorized");
    return;
  }
  task = req.body;
  fs.readFile("./tasks.txt", "utf-8", (err, data) => {
    if (err) {
      res.send(err);
    } else {
      if (data == "") {
        res.send("noting to show");
      }
      try {
        data = JSON.parse(data);
        data.forEach((element) => {
          if (element.task == task.task) {
            element.isCompleted = task.isCompleted;
          }
        });
        fs.writeFile("./tasks.txt", JSON.stringify(data), (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log("File written successfully\n");
          }
        });
        res.send(data);
      } catch (err) {
        console.log(err);
      }
    }
  });
});
app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
