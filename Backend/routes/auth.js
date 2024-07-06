const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const  jwt = require('jsonwebtoken');
var fetchuser=require("../middleware/fetchuser");
const Jwt_secret="Hello Nikhil this Side";
const saltRounds = 10;
//Route 1:For creating user

router.post('/createuser', [
  body('name', 'Enter a valid name').isLength({ min: 3 }),
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password must be atleast 5 character').isLength({ min: 5 }),

], async (req, res) => {
  // console.log(req.body.name);
  let success = false;
  const errors = validationResult(req);
  // console.log(errors);
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
  }
  try {
      let user = await User.findOne({ email: req.body.email })
      if (user) {
          return res.status(400).json({success, error: "Sorry a user with email id already exists" })
      }
      const salt = await bcrypt.genSalt(saltRounds);
      const secPass = await bcrypt.hash(req.body.password,salt);
      user = await User.create({
          name: req.body.name,
          email: req.body.email,
          password: secPass,
      })
      const data = {
          user : {
              id : user.id
          }
      }
      const authToken = jwt.sign(data,Jwt_secret);
      success =true;
      res.json({success,authToken})
  }
  catch(error) {
      console.error(error.message);
      res.status(500).send("Some error ocuured");
  }



  // .then(user => res.json(user))
  // .catch(err=> {console.log(err)
  // res.json({error :"Please enter a unique value for email",message :err.message})})

  
});


//Route 2:For Login
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists(),
  ], async (req, res) => {
    let success = false;
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        success = false
        return res.status(400).json({ error: "Please try to login with correct credentials" });
      }
  
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        success = false
        return res.status(400).json({ success, error: "Please try to login with correct credentials" });
      }
  
      const data = {
        user: {
          id: user.id
        }
      }
      const authtoken = jwt.sign(data, Jwt_secret);
      success = true;
      res.json({ success, authtoken })
  
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  
  
  });





router.post('/getuser', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});


module.exports = router;






