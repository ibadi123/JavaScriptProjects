const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
const port = 3000;

app.get("/", (req, res) => {
  res.send(`
    <div>
        <form method="POST">
            <input name="email" placeholder = "email"/>
            <input name="password" placeholder = "password"/>
            <input name="passwordConfirmation" placeholder = "password confirmation"/>
            <button>Sign Up</button>
        </form>
    </div>
  `);
});

app.post("/", (req, res) => {
  // Getting Access to Data
  console.log(req.body);
  res.send("Account Created!");
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
