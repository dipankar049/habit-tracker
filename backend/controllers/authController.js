const User = require("../models/User");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async(req, res) => {
    try {
        const { username, email, password } = req.body;

        if(!username.trim() || !email.trim() || !password.trim()) {
            return res.status(400).json({ message: "All fields are required"});
        }

        const existingUser = await User.findOne({email});
        if(existingUser) return res.status(400).json({ message: "Email already registered"});

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = new User({ username, email, passwordHash });
        await newUser.save();

        return res.status(201).json({ message: "User registered successfully"});
    } catch(err) {
        console.log("Error occured: ", err);
        res.status(500).json({ error: "Something went wrong while registering"});
    }
}

const loginUser = async(req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({email});
        if(!user) return res.status(404).json({message: "User not found"});

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if(!isMatch) return res.status(401).json({ message: "Wrong password"});

        const token = jwt.sign(
            { id: user._id, username: user.username, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1w'}
        );

        res.status(200).json({
            message: "Login successfull",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            }
        });
    } catch(err) {
        console.log("Error occured: ", err);
        res.status(500).json({ error: "Something went wrong during login"});
    }
};

const getProfile = async (req, res) => {
  try {
    const user = req.user;

    res.status(200).json({
      username: user.username,
      email: user.email,
      joinDate: user.joinDate,
      avatarUrl: user.avatarUrl || "",
      xp: user.xp || 0,
      level: user.level || 1,
      streak: user.streak || 0,
    });
  } catch (error) {
    console.error("Profile Error:", error);
    res.status(500).json({ message: "Server error while fetching profile" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const user = req.user;

    const { username, avatar } = req.body;

    if (username !== undefined) user.username = username;
    if (avatar !== undefined) user.avatar = avatar;

    const updatedUser = await user.save();

    res.status(200).json({
      id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      message: "Profile updated successfully",
    });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { registerUser, loginUser, getProfile, updateProfile };