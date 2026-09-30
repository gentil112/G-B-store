const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Check if all fields were provided
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please provide name, email and password",
      });
    }

    // 2. Check if the email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User with this email already exists",
      });
    }

    // 3. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create the user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // 5. Send response
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Registration error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check if email and password were provided
    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide email and password",
      });
    }

    // 2. Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // 3. Compare the password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    // 4. Login successful
    res.status(200).json({
      message: "Login successful",

      token: token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};
const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    // 1. Check if Google credential was provided
    if (!credential) {
      return res.status(400).json({
        message: "Google credential is required",
      });
    }

    // 2. Verify the credential with Google
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    // 3. Get the user's Google information
    const payload = ticket.getPayload();

    const { sub: googleId, name, email } = payload;

    // 4. Find an existing user
    let user = await User.findOne({ email });

    // 5. Create the user if they don't exist
    if (!user) {
      user = await User.create({
        name,
        email,
        googleId,
        authProvider: "google",
      });
    }

    // 6. Create OUR JWT
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    // 7. Send response
    res.status(200).json({
      message: "Google login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Google login error:", error.message);

    res.status(401).json({
      message: "Google authentication failed",
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { name, email } = req.body;

    if (!userId) {
      return res.status(401).json({
        message: "Not authorized. Please login again.",
      });
    }

    if (!name || !email) {
      return res.status(400).json({
        message: "Name and email are required.",
      });
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName || !trimmedEmail) {
      return res.status(400).json({
        message: "Name and email are required.",
      });
    }

    const existingUser = await User.findOne({
      email: trimmedEmail,
      _id: { $ne: userId },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "A user with this email already exists.",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name: trimmedName,
        email: trimmedEmail,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error.message);
    res.status(500).json({
      message: "Server error while updating profile",
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { currentPassword, password } = req.body;

    if (!userId) {
      return res.status(401).json({
        message: "Not authorized. Please login again.",
      });
    }

    if (!password || !password.trim()) {
      return res.status(400).json({
        message: "Please enter your new password.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "New password must be at least 6 characters long.",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    // Google accounts do not have a local password until the user sets one.
    // A valid Google-authenticated JWT is sufficient to create that first one.
    if (user.password) {
      if (!currentPassword || !currentPassword.trim()) {
        return res.status(400).json({
          message: "Please enter your current password.",
        });
      }

      const isCurrentPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password,
      );

      if (!isCurrentPasswordValid) {
        return res.status(401).json({
          message: "Current password is incorrect.",
        });
      }
    } else if (user.authProvider !== "google") {
      return res.status(400).json({
        message: "This account does not have a password that can be changed.",
      });
    }

    user.password = await bcrypt.hash(password, 10);
    await user.save();

    res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error.message);
    res.status(500).json({
      message: "Server error while changing password",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  googleLogin,
  updateProfile,
  changePassword,
};
