import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/droneDatabase")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

const { Schema } = mongoose;

const userSchema = new Schema({
    username: String,
    email:String,
    password: String,
    googleId: String,
    images: [
      {
        imageId: String,
        imageUrl: String,
        uploadDate: Date
      }
    ],
    keybinds: [

      {
        leftMotorForward: String,
        leftMotorBackward:String,

        rightMotorForward: String,
        rightMotorBackward:String,

      }

    ]
});

userSchema.plugin(passportLocalMongoose);
const User = mongoose.model("User", userSchema);

export { User, userSchema };
