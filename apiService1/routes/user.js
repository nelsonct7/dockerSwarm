const app = require("express");
const UserModel = require("../models/User");
const jwt = require("jsonwebtoken");

const router = app.Router();

const JWT_SECRETE = process.env.JWT_SECRETE;

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide user email and password" });
    }
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "Requested user is no found" });
    }
    const isValid = await user.comparePassword(password);
    if (isValid) {
      const token = jwt.sign({ user: user._id }, JWT_SECRETE, {
        expiresIn: "1h", // Token expires in 1 hour
      });
      return res.status(200).send({
        message: "User Logged In",
        token: token,
      });
    } else {
      return res.status(400).send({
        message: "Wrong Password",
      });
    }
  } catch (error) {
    console.log("[!] ", error);
    return res.status(500).json({ message: "Server failed at login action" });
  }
});

router.post("/signup", async (req, res) => {
  try {
    console.log("[!] ddddd", req.body);
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide user email and password" });
    }
    // Creating empty user object
    let newUser = new UserModel();

    // Initialize newUser object with request data
    newUser.email = email;
    newUser.password = password;

    // Save newUser object to database
    await newUser.save();

    return res.status(201).send({
      message: "User added successfully.",
    });
  } catch (error) {
    console.log("[!] ", error);
    return res.status(500).json({ message: "Server failed at signup action" });
  }
});

module.exports = router;
