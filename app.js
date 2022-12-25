require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
// const _ = require("lodash");

const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

console.log(process.env.API_key);
const db = 'mongodb://localhost:27017/userDB';

mongoose.set('strictQuery', true);

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect(db);

}

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(encrypt, { secret: process.env.secret, encryptedFields: ['password'] });

const users = mongoose.model('user', userSchema);

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get('/', function (req, res) {
    res.render("home");
});
app.get('/login', function (req, res) {
    res.render("login");
});
app.get('/register', function (req, res) {
    res.render("register");
});

app.post('/register', function (req, res) {
    const newuser = new users({
        email: req.body.username,
        password: req.body.password
    });

    newuser.save(function (err) {
        if (err) {
            console.log(err);
        }
        else
            res.render("secrets");
    })
})


app.post("/login", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    users.findOne({ email: username }, function (err, founduser) {
        if (err) {
            console.log(err);
        }
        else {
            if (founduser) {
                if (founduser.password === password)
                    res.render("secrets");
            }
        }
    });
});

app.listen(3000, function () {
    console.log("Server started on port 3000");
});
