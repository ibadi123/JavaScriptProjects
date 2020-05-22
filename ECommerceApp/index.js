const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const usersRepo = require("./repos/users");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cookieSession({
    keys: ["lidyensyg44623nsdy2239sdndfus1245%jeyf6s8hetkas73"],
  })
);
const port = 3000;

app.get("/signup", (req, res) => {
  res.send(`
    <div>
  Your id is: ${req.session.userId}
        <form method="POST">
            <input name="email" placeholder = "email"/>
            <input name="password" placeholder = "password"/>
            <input name="passwordConfirmation" placeholder = "password confirmation"/>
            <button>Sign Up</button>
        </form>
    </div>
  `);
});

app.post("/signup", async (req, res) => {
  // Getting Access to Data
  const { email, password, passwordConfirmation } = req.body;
  const existingUser = await usersRepo.getOneBy({ email });
  if (existingUser) {
    return res.send("Email Already Taken");
  }

  if (password !== passwordConfirmation) {
    return res.send("Passwords must match!");
  }

  // Creating User
  const user = await usersRepo.create({ email, password });

  req.session.userId = user.id;

  res.send("Account Created!");
});

app.get("/signout", (req, res) => {
  req.session = null;
  res.send("You are logged out!");
});

app.get("/signin", (req, res) => {
  res.send(`
  <div>
  <form method="POST">
      <input name="email" placeholder = "email"/>
      <input name="password" placeholder = "password"/>
      <button>Sign In</button>
  </form>
</div>
  `);
});

app.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  const user = await usersRepo.getOneBy({ email });

  if (!user) {
    return res.send("Email not found!");
  }

  const validPassword = await usersRepo.comparePasswords(
    user.password,
    password
  );

  if (!validPassword) {
    return res.send("Invalid Password!");
  }

  req.session.userId = user.id;

  res.send("You are signed in!");
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
