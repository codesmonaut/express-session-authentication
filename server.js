require(`dotenv`).config();
const express = require(`express`);
const session = require(`express-session`);

// App config
const app = express();
const port = process.env.PORT || 3030;
app.set(`view-engine`, `ejs`);

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false
}))

// DB config
const users = [];

// API endpoints
app.post(`/register`, (req, res) => {
    const newUser = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    }

    users.push(newUser);
    req.session.user = newUser;
    res.redirect(`/`);
})

app.post(`/login`, (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const user = users.find(acc => acc.email === email);

    if (password === user.password) {
        req.session.user = user;
        res.redirect(`/`);
    }

    if (password !== user.password) {
        res.status(401).send(`Incorrect password.`);
    }
})

app.get(`/users`, (req, res) => {
    res.status(200).send(users);
})

// Views endpoints
app.get(`/`, (req, res) => {
    const user = req.session.user;

    if (!user) {
        res.redirect(`/login`);
    }

    res.render(`index.ejs`, { username: user.username });
})

app.get(`/register`, (req, res) => {
    res.render(`register.ejs`);
})

app.get(`/login`, (req, res) => {
    res.render(`login.ejs`);
})

// Listener
app.listen(
    port,
    console.log(`Server is running on port http://localhost:${port}`)
)