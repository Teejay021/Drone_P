import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import cors from "cors";
import AWS from "aws-sdk";
import session from "express-session";
import passport from "passport";
import { User, userSchema } from "./db.js";
import GoogleStrategy from "passport-google-oauth2";
import FacebookStrategy from "passport-facebook";
import GitHubStrategy from "passport-github";
import findOrCreate from "mongoose-findorcreate";
import bcrypt from "bcrypt";



dotenv.config();


const app = express();

const saltRounds = 10;

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(session({

  secret:process.env.SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

userSchema.plugin(findOrCreate);


passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3002/auth/google/secrets",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        const user = await User.findOne({ email: profile.email });
      
        if (!user) {
          const newUser = new User({ email: profile.email, password: "google", username: profile.id });
          await newUser.save();
          return cb(null, newUser);
        }

        return cb(null, user);
      } catch (err) {
        return cb(err);
      }
    }
  )
);


passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: "http://localhost:3002/auth/facebook/secrets"
},
async (accessToken, refreshToken, profile, cb) => {
  try {
    const user = await User.findOne({ email: profile.email });

    if (!user) {
      const newUser = new User({ email: profile.email, password: "facebook", username: profile.id });
      await newUser.save();
      return cb(null, newUser);
    }

    return cb(null, user);
  } catch (err) {
    return cb(err);
  }
}
));

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: "http://localhost:3002/auth/github/secrets"
},
async (accessToken, refreshToken, profile, cb) => {
  try {
    const user = await User.findOne({ email: profile.email });

    if (!user) {
      const newUser = new User({ email: profile.email, password: "github", username: profile.id });
      await newUser.save();
      return cb(null, newUser);
    }

    return cb(null, user);
  } catch (err) {
    return cb(err);
  }
}
));

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.APP_PASSWORD
  }
});


AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "us-west-2" // Your bucket"s region
});

const s3 = new AWS.S3();



app.post("/send-email", (req, res) => {



  const { fName, lName,email, phoneNumber, message } = req.body;
  const mailOptions = {
    from: process.env.EMAIL ,
    to: process.env.RECIEVER_EMAIL, // your email to receive messages
    subject: `New Form Submission`,
    text: `Name: ${fName} ${lName}\nEmail: ${email}\nPhone: ${phoneNumber}\nMessage: ${message}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      return res.status(500).send(`Error sending email: ${error.message}`);
    } else {
      return res.status(200).send("Email sent: " + info.response);
    }
  });
});

app.post("/updateDatabase/:userId", async function(req, res) {
  try {
    const { userId } = req.params;
    const keybinds = req.body; 

    // Find the user by ID and update the keybind
    await User.findByIdAndUpdate(userId, { $set: { keybinds: keybinds } });

    res.status(200).send("Keybinds updated successfully");
  } catch (error) {
    console.error("Error updating keybinds:", error);
    res.status(500).send("An error occurred while updating keybinds");
  }
});


app.post("/register", async (req, res) => {
  const { email, password, username } = req.body;

  try {
    const existingEmail = await User.findOne({ email });
    const existingUserId = await User.findOne({ username });

    if (existingEmail) {
      return res.redirect("/login"); // User already exists, redirect to login
    } else if (existingUserId) {
      console.log("lmao found it");
      return res.status(400).send("Username is already taken");
    }

    const newUser = new User({ email, password, username });
    await newUser.save();

    req.login(newUser, (err) => {
      if (err) {
        console.error("Error logging in user:", err);
        return res.status(500).send("Error logging in user");
      }
      console.log("User registered successfully");
      return res.status(200).send("Error logging in user");
    });
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).send("Error registering user");
  }
});


app.get("/auth/google", 
  passport.authenticate("google", { scope: ["email", "profile", "username"] })
);

app.get("/auth/google/secrets", 
  passport.authenticate("google", { 
    failureRedirect: "/login-failure" }),
  function(req, res) {
    // Instead of redirecting, send relevant data back
    res.json({ user: req.user, token: "YourGeneratedToken" });
  }
);

app.get("/auth/facebook",
  passport.authenticate("facebook")
);

app.get("/auth/facebook/secrets",  passport.authenticate("facebook", { 
    failureRedirect: "/login-failure" }),
    function(req, res) {
      // Successful authentication, need to send status here since using react
      res.redirect("/");
    }
);

  app.get("/auth/github",
  passport.authenticate("github")); 


app.get("/auth/github/secrets", 
  passport.authenticate("github", { 
    failureRedirect: "/login-failure"
}),
  function(req, res) {
    // Successful authentication, redirect home.
    res.json({ user: req.user, token: "YourGeneratedToken" });
    console.log("lol");
  }
);

app.get("/login-failure", (req, res) => {
  res.json({ error: "Authentication failed" });
});

app.post("/login", function(req,res){

  const user = new User ({

    username: req.body.username,
    password: req.body.password,

  });

  req.login(user, function(err){

    if(err){
      console.log(err)
      return res.status(500).send(`Error logining user: ${err.message}`);
    } else{
      passport.authenticate("local")(req,res,function(){

        // res.redirect("/whateverRouteAftyerRegistration");
        return res.status(200).send(`user registered successfully`);

      });
    }
  })
});

app.get("/logout", function(req, res){

  req.logOut();
  res.redirect("/");
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {

  console.log(`Server running on port ${PORT}`);

});