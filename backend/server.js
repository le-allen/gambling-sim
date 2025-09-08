const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

// put env shit here for JWT SECRET and Mongoose
const db = ""

const app = express();
app.use(express.json());
app.use(cors());

const JWT_SECRET = "";

mongoose.connect(db)
.then(() => console.log("DB CONNECT OK"))
.catch(err => console.error("DB CONNECT FAIL: " + err));

const userSchema = new mongoose.Schema({
    username: {
        type: String, 
        unqiue: True, 
        require: True
    },
    password: String,
    balance: {type: DECIMAL(10,2)},
    day: {
        type: String, 
        enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'], 
        required: true
    }
});

const User = mongoose.model(userSchema);

// register
app.post("/register", async (req, res) => {
    const{username, password} = req.body;
    // const hashedPw = await bcrypt.hash(password, 10);
    try {
        const user = new User({username, password});
        await user.save();
        res.json({message: "User created: " + username});
    } catch (err) {
        console.log(err)
    }
});

// login
app.post("/register", async (req, res) => {
    const{username, password} = req.body;
    const user = await User.findOne({username});
    if(!user) return res.json({message: "user DNE"});

    // fix if implement hashed pw
    if(!compare(password, user.password)) return res.json({message: "wrong password"});
});

