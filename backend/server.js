import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import cors from "cors";
import AWS from "aws-sdk";
import passport from "passport";
import { User } from "./db.js"; // Ensure db.js exports User model properly
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { Strategy as GitHubStrategy } from "passport-github";
import bcrypt from "bcrypt";
import cookieParser from 'cookie-parser';
import session from 'express-session';
import axios from "axios";
import authRoutes from "./auth.js"; // Import the auth routes

dotenv.config();

const CLIENT_URL = "http://localhost:3000";
const app = express();

app.use(cors({
  origin: CLIENT_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(session({
  secret: 'YourSecretKey',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }  // Adjust secure: true for HTTPS
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user.id);  // Save user id to session
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    if (user) {
      done(null, {
        id: user._id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,  // This line ensures displayName is included
        image: user.image
      });
    } else {
      done(null, null);
    }
  } catch (err) {
    done(err, null);
  }
});




const strategyCallback = async (accessToken, refreshToken, profile, done) => {
  console.log(profile);
  try {
    const email = profile.emails?.[0]?.value;
    if (!email) {
      return done(new Error('No email associated with this account.'));
    }

    const user = await User.findOneAndUpdate(
      { email },
      {
        $set: {
          username: profile.id,
          displayName: profile.displayName,
          email: email,
          image: profile.photos?.[0]?.value // Save the profile picture
        }
      },
      { new: true, upsert: true }
    );
    done(null, user);
  } catch (err) {
    done(err);
  }
};


const githubStrategyCallback = async (accessToken, refreshToken, profile, done) => {
  try {
    const res = await fetch('https://api.github.com/user/emails', {
      headers: {
        'Authorization': `token ${accessToken}`
      }
    });
    const emails = await res.json();

    if (emails && emails.length > 0) {
      const primaryEmail = emails.find(email => email.primary && email.verified)?.email;

      if (primaryEmail) {
        profile.email = primaryEmail;
        done(null, profile);
      } else {
        done(new Error('No verified email associated with this account.'));
      }
    } else {
      done(new Error('No email found. Your email might be private. Please update your GitHub settings or use a different login method.'));
    }
  } catch (err) {
    done(err);
  }
};



passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3002/auth/google/secrets",
  userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
}, strategyCallback));

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: "http://localhost:3002/auth/facebook/secrets",
  profileFields: ['id', 'emails', 'name']
}, strategyCallback));

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: "http://localhost:3002/auth/github/secrets",
  scope: ['user:email', 'read:user']  // Request email explicitly
}, strategyCallback));


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS
  }
});

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "us-west-2"
});

const s3 = new AWS.S3();

app.post("/send-email", (req, res) => {
  const { fName, lName, email, phoneNumber, message } = req.body;
  const mailOptions = {
    from: process.env.EMAIL,
    to: process.env.RECEIVER_EMAIL,
    subject: "New Form Submission",
    text: `Name: ${fName} ${lName}\nEmail: ${email}\nPhone: ${phoneNumber}\nMessage: ${message}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send(`Error sending email: ${error.message}`);
    } else {
      return res.status(200).send("Email sent: " + info.response);
    }
  });
});

app.post("/register", async (req, res) => {
  const { email, password, username } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(409).send("Email or username already exists.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword, username });
    await newUser.save();
    req.login(newUser, err => {
      if (err) {
        return res.status(500).send("Error logging in user.");
      }
      return res.status(200).send("User registered successfully.");
    });
  } catch (err) {
    return res.status(500).send("Error registering user.");
  }
});

app.use("/auth", authRoutes); // Using the auth routes

app.get("/login-failure", (req, res) => {
  res.status(401).json({
    error: "Authentication failed."
  });
});

// Middleware to verify custom cookie
app.use((req, res, next) => {
  const userCookie = req.cookies.user;
  if (userCookie) {
    req.user = JSON.parse(userCookie);
  }
  next();
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


