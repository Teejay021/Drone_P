import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import cors from "cors";
import AWS from "aws-sdk";
import passport from "passport";
import { User } from "./db.js"; // Ensure db.js exports User model properly
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { Strategy as GitHubStrategy } from "passport-github";
import bcrypt from "bcrypt";
import cookieParser from 'cookie-parser';
import session from 'express-session';
import axios from "axios";
import jwt from "jsonwebtoken";
import authRoutes from "./auth.js";
import multer from "multer";
import crypto from "crypto";

dotenv.config();

const CLIENT_URL = "http://localhost:3000";
const app = express();

app.use(cors({
  origin: CLIENT_URL,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(session({
  secret: 'YourSecretKey',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, sameSite: 'lax' }
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    if (user) {
      done(null, {
        id: user._id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
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
    const r = await fetch('https://api.github.com/user/emails', {
      headers: { 'Authorization': `token ${accessToken}` }
    });
    const emails = await r.json();
    const primaryEmail = emails?.find(e => e.primary && e.verified)?.email;
    if (!primaryEmail) return done(new Error('No verified email associated with this GitHub account.'));

    const user = await User.findOneAndUpdate(
      { email: primaryEmail },
      {
        $set: {
          username: profile.id,
          displayName: profile.displayName || profile.username,
          email: primaryEmail,
          image: profile.photos?.[0]?.value
        }
      },
      { new: true, upsert: true }
    );
    done(null, user);
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
  region: process.env.AWS_REGION || "us-west-2"
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

    const hashed = await bcrypt.hash(password, 10);
    const newUser = new User({ email, username, password: hashed });
    await newUser.save();

    req.login(newUser, (err) => {
      if (err) {
        return res.status(500).send("Error logging in user.");
      }
      
      return res.status(200).json({ user: { username: newUser.username, email: newUser.email } });
    });
  } catch (err) {
    return res.status(500).send("Error registering user.");
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "User not found" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: "Invalid password" });

    req.login(user, (err) => {
      if (err) {
        console.error("req.login error:", err);
        return res.status(500).json({ error: "Login failed" });
      }
      console.log("Login successful, session:", req.session);
      console.log("Login successful, isAuthenticated:", req.isAuthenticated());
      return res.status(200).json({
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      });
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.use("/auth", authRoutes);

app.get("/login-failure", (req, res) => {
  res.status(401).json({
    error: "Authentication failed."
  });
});

function ensureLoggedIn(req, res, next) {
  console.log("ensureLoggedIn - isAuthenticated:", req.isAuthenticated());
  console.log("ensureLoggedIn - session:", req.session);
  console.log("ensureLoggedIn - user:", req.user);
  
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: "Login required" });
}


app.post("/updateDatabase", ensureLoggedIn, async (req, res) => {
  const {keybinds } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.keybinds = keybinds;
    await user.save();
    return res.status(200).json({ message: "Keybinds updated successfully" });
  } catch (error) {
    console.error("Error updating keybinds:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/keybinds", ensureLoggedIn, async (req, res) => {
  const userId = req.user.id;              
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json(user.keybinds || {});
  } catch (error) {
    console.error("Error fetching keybinds:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
  
});

// Image upload/list/delete to S3
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

const S3_BUCKET = process.env.S3_BUCKET;
const S3_REGION = process.env.AWS_REGION || "us-west-2";
const S3_BASE_URL = process.env.S3_BASE_URL || (S3_BUCKET ? `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com` : "");

app.post("/images", ensureLoggedIn, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    if (!S3_BUCKET) {
      console.error("Upload error: S3_BUCKET env is not set");
      return res.status(500).json({ message: "Server misconfigured: missing S3 bucket" });
    }
    const userId = req.user.id;
    const ext = (req.file.originalname.split(".").pop() || "jpg").toLowerCase();
    const key = `users/${userId}/${crypto.randomUUID()}.${ext}`;
    // Try with public-read ACL, and if ACLs are disabled on the bucket, retry without ACL
    const putParams = {
      Bucket: S3_BUCKET,
      Key: key,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
      ACL: "public-read",
    };
    try {
      await s3.putObject(putParams).promise();
    } catch (err) {
      if (String(err?.message || "").includes("AccessControlListNotSupported") || 
          String(err?.code || "") === "AccessControlListNotSupported" || 
          String(err?.code || "") === "InvalidRequest") {
        console.warn("Bucket ACLs disabled; retrying upload without ACL");
        const { ACL, ...noAclParams } = putParams;
        await s3.putObject(noAclParams).promise();
      } else {
        throw err;
      }
    }

    const imageUrl = S3_BASE_URL ? `${S3_BASE_URL}/${key}` : key;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    const imageId = crypto.randomUUID();
    const newImage = { imageId, imageUrl, uploadDate: new Date(), favorite: false };
    
    console.log("Creating new image:", newImage);
    
    user.images.push(newImage);
    await user.save();
    
    console.log("User after save:", {
      userId: user._id,
      imageCount: user.images.length,
      lastImage: user.images[user.images.length - 1]
    });

    return res.status(201).json(newImage);
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ message: "Failed to upload image" });
  }
});

app.get("/images", ensureLoggedIn, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    
    console.log("User images before processing:", user.images);
    
    // Sort newest first
    const images = (user.images || []).sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));

    // Generate signed URLs for private objects if possible
    const imagesWithDisplayUrl = await Promise.all(
      images.map(async (img, index) => {
        console.log(`Processing image ${index}:`, {
          raw: img,
          imageId: img.imageId,
          _id: img._id,
          favorite: img.favorite,
          hasToObject: !!img.toObject
        });
        
        try {
          // Derive S3 key from stored URL
          const keyFromUrl = typeof img.imageUrl === "string" && img.imageUrl.includes(`${S3_BASE_URL}/`)
            ? img.imageUrl.split(`${S3_BASE_URL}/`)[1]
            : img.imageUrl;

          if (S3_BUCKET && keyFromUrl && typeof keyFromUrl === "string") {
            const signedUrl = s3.getSignedUrl("getObject", {
              Bucket: S3_BUCKET,
              Key: keyFromUrl,
              Expires: 60 * 60, // 1 hour
            });
            const processedImg = {
              imageId: img.imageId,
              imageUrl: img.imageUrl,
              uploadDate: img.uploadDate,
              favorite: img.favorite,
              signedUrl
            };
            console.log(`Processed image ${index} (with signed URL):`, {
              imageId: processedImg.imageId,
              _id: processedImg._id,
              favorite: processedImg.favorite
            });
            return processedImg;
          }
        } catch (e) {
          console.warn("Signed URL generation failed:", e?.message || e);
        }
        const processedImg = {
          imageId: img.imageId,
          imageUrl: img.imageUrl,
          uploadDate: img.uploadDate,
          favorite: img.favorite
        };
        console.log(`Processed image ${index} (no signed URL):`, {
          imageId: processedImg.imageId,
          _id: processedImg._id,
          favorite: processedImg.favorite
        });
        return processedImg;
      })
    );

    console.log("Final images being sent:", imagesWithDisplayUrl);
    return res.json(imagesWithDisplayUrl);
  } catch (err) {
    console.error("List images error:", err);
    return res.status(500).json({ message: "Failed to fetch images" });
  }
});

app.delete("/images/:imageId", ensureLoggedIn, async (req, res) => {
  try {
    const { imageId } = req.params;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    const idx = (user.images || []).findIndex((img) => img.imageId === imageId);
    if (idx === -1) return res.status(404).json({ message: "Image not found" });

    const image = user.images[idx];
    // Attempt to delete from S3 if key is within our bucket
    try {
      const keyFromUrl = image.imageUrl.split(`${S3_BASE_URL}/`)[1];
      if (keyFromUrl) {
        await s3.deleteObject({ Bucket: S3_BUCKET, Key: keyFromUrl }).promise();
      }
    } catch (s3err) {
      console.warn("S3 delete warning:", s3err?.message);
    }

    user.images.splice(idx, 1);
    await user.save();
    return res.json({ message: "Deleted" });
  } catch (err) {
    console.error("Delete image error:", err);
    return res.status(500).json({ message: "Failed to delete image" });
  }
});

app.patch("/images/:imageId/favorite", ensureLoggedIn, async (req, res) => {
  try {
    const { imageId } = req.params;
    console.log("Favorite toggle request for imageId:", imageId);
    
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    
    const img = (user.images || []).find((i) => i.imageId === imageId);
    console.log("Found image:", img);
    
    if (!img) return res.status(404).json({ message: "Image not found" });
    
    img.favorite = !img.favorite;
    console.log("New favorite status:", img.favorite);
    
    await user.save();
    return res.json({ imageId, favorite: img.favorite });
  } catch (err) {
    console.error("Favorite toggle error:", err);
    return res.status(500).json({ message: "Failed to update favorite" });
  }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


