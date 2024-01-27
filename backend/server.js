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
import findOrCreate from 'mongoose-findorcreate';






dotenv.config();

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000",
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
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


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3002/auth/google/secrets",
  passReqToCallback   : true
},
function(request, accessToken, refreshToken, profile, done) {
  
  User.findOrCreate({ googleId: profile.id }, function (err, user) {
    return done(err, user);
  });
}
));

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: "http://localhost:3002/auth/facebook/secret"
},
function(accessToken, refreshToken, profile, cb) {
  User.findOrCreate({ facebookId: profile.id }, function (err, user) {
    return cb(err, user);
  });
}
));

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: "http://127.0.0.1:3002/auth/github/secrets"
},
function(accessToken, refreshToken, profile, cb) {
  User.findOrCreate({ githubId: profile.id }, function (err, user) {
    return cb(err, user);
  });
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


app.post("/register", function(req, res) {
  const newUser = new User({
      username: req.body.username,
      email: req.body.email 
  });

  User.register(newUser, req.body.password, function(err, user) {
      if (err) {
          console.error("Error registering user:", err);
          return res.status(500).send(`Error registering user: ${err.message}`);
      } else {
          passport.authenticate("local")(req, res, function() {
              return res.status(200).send(`User registered successfully`);
          });
      }
  });
});

app.get("/auth/google", 
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get("/auth/google/secrets", 
  passport.authenticate("google", { failureRedirect: "/login-failure" }),
  function(req, res) {
    // Instead of redirecting, send relevant data back
    res.json({ user: req.user, token: 'YourGeneratedToken' });
  }
);

app.get("/auth/facebook",
  passport.authenticate("facebook"));

app.get("/auth/facebook/secrets",
  passport.authenticate("facebook", { failureRedirect: "/login-failure" }),
  function(req, res) {
    // Successful authentication, need to send status here since using react
    res.redirect("/");
  });

  app.get("/auth/github",
  passport.authenticate("github"));


app.get("/auth/github/secrets", 
  passport.authenticate("github", { failureRedirect: "/login-failure" }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.json({ user: req.user, token: 'YourGeneratedToken' });
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
})

app.get("/logout", function(req, res){

  req.logOut();
  res.redirect("/homePage");
})

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {

  console.log(`Server running on port ${PORT}`);

});
