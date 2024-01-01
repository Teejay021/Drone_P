import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import cors from 'cors';
import AWS from "aws-sdk";
import session from "express-session";
import passport from "passport";
import passportLocalMongoose from "passport-local-mongoose";
import { User } from './db.js';






dotenv.config();

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000'
}));

app.use(session({

  secret:process.env.SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.APP_PASSWORD
  }
});


AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-west-2' // Your bucket's region
});

const s3 = new AWS.S3();



app.post('/send-email', (req, res) => {



  const { fName, lName,email, phoneNumber, message } = req.body;
  const mailOptions = {
    from: process.env.EMAIL ,
    to: process.env.RECIEVER_EMAIL, // your email to receive messages
    subject: `New Form Submission`,
    text: `Name: ${fName} ${lName}\nEmail: ${email}\nPhone: ${phoneNumber}\nMessage: ${message}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).send(`Error sending email: ${error.message}`);
    } else {
      return res.status(200).send('Email sent: ' + info.response);
    }
  });
});

app.post("/updateDatabase/$userId")


app.post("/register", function(req,res){

  User.register({username: req.body.username},{password: req.body.password}, function(err,user){

    if(err){
      // res.redirect("/register");
      return res.status(500).send(`Error registering user: ${err.message}`)

    }else{

      passport.authenticate("local")(req,res,function(){

        // res.redirect("/whateverRouteAftyerRegistration");
        return res.status(200).send(`user registered successfully`);
      });
    }
  });
})

app.get("/whateverRouteAftyerRegistration", function (req, res){

  if(req.isAuthenticated()){

    res.render("whateverRouteAftyerRegistration")
  }else{

    res.redirect("/login");
  }
})

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
