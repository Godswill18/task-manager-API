const UserModel = require('../models/userModel.js');
const bcrypt = require('bcrypt');
const {generateTokenAndSetCookie} = require('../lib/utils/generateToken.js'); // Assuming you have a utility to generate JWT tokens

const registerUser = async (req, res) => {
  try {
    const User = await UserModel(); // Get the model instance here

    // check if user already exists
    const existingUser = await User.findOne({ where: { email: req.body.email } });

    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // create new user
    const newUser = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashedPassword,
      isAdmin: req.body.isAdmin || false, // Default to false if not provided
    });

   
      

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        password: newUser.password,
        isAdmin: newUser.isAdmin, 
      }
    });

  } catch (error) {
    // console.log(error);
    console.error("Error in registerUser:", error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const login = async (req, res) => {
  try {
    const User = await UserModel(); // Get the model instance here

    // find user by email
    const user = await User.findOne({ where: { email: req.body.email } });
    const isCorrectPassword = await bcrypt.compare(req.body.password, user.password);

    if (!user || !isCorrectPassword) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    // send response
    // Generate JWT token and set it in cookies
    generateTokenAndSetCookie(user.id, res);
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isAdmin: user.isAdmin, 
      }
    });

  } catch (error) {
    console.error("Error in login:", error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

const logout = (req, res) => {
  try{
    // Clear Cookies
    res.clearCookie("jwt", "", {maxAge: 0});
    res.status(200).json({ success: true, message: 'Logout successful' });

  }catch(error){
    console.error("Error logging out:", error.message);
    res.status(500).json({success: false, message: 'Internal server error'});
  }
}

module.exports = { registerUser, login, logout };
