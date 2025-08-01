import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
  _id:string;
  content: string;
  createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: [true, "Message content cannot be empty"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

export interface User extends Document {
  userName: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  isAcceptingMessages: boolean;
  messages: Message[];
}

const UserSchema: Schema<User> = new Schema({
  userName: {
    type: String,
    required: [true, "user name is required"],
    trim: true,
    unique: true,
    index: true,
    lowercase: true,
  },
  email: {
    type: String,
    required: [true, "email is required"],
    trim: true,
    unique: true,
    index: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  verifyCode: {
    type: String,
    required: [true, "verify code is required"],
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, "verifyCode Expiry date is required"],
  },
  isVerified: {
    type: Boolean,
    default:false
  },
  isAcceptingMessages: {
    type:Boolean,
    default:true
  },
  messages: [MessageSchema],
});

const UserModel: mongoose.Model<User> = 
  mongoose.models.User || mongoose.model<User>("User", UserSchema);

export default UserModel