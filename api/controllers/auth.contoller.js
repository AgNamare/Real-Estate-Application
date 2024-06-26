import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import {errorHandler} from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async(req, res, next)=>{
  const  { username, email, password} = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = new User({username, email, password:hashedPassword});
  try {
    await newUser.save();
    res.status(201).json("User Created Successfully") ;
  } catch (error) {
    next(error);
  };
};

export const signIn = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "Wrong Credentials!"));
    const validPassword = bcrypt.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "Wrong Credentials!"));
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...userInfo } = validUser._doc;
    // Set the cookie with SameSite=None for cross-site usage
    res.cookie("access_token", token, { httpOnly: true, secure: true, sameSite: 'none' }).status(200).json(userInfo);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({email:req.body.email});
    if(user) {
      const token = jwt.sign({id:user._id}, process.env.JWT_SECRET);
      const { password:pass, ...rest} = user._doc;
      res.cookie("access_token", token, { httpOnly: true, secure: true, sameSite: 'none' }).status(200).json(rest);
    }else{
      //creating a password for google user
      const generatedPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = bcrypt.hashSync(generatedPassword, 10);
      const newUser = new User({username: req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-8), email:req.body.email, password:hashedPassword, avatar:req.body.photo});
      await newUser.save();
      //creating a token to authenticate a user
      const token = jwt.sign({id:user._id}, process.env.JWT_SECRET);
      const { password:pass, ...rest} = user._doc;
      res.cookie("access_token", token, {
        httpOnly: true,
        secure: false,
        sameSite: 'none'
      }).status(200).json(rest);
    }
  } catch (error) {
    next(error);
  }
};

export const signOut = async(req, res, next) => {
  try {
    res.clearCookie('access_token');
    res.status(200).json("User has been logged out!");
  } catch (error) {
    next(error);
  }
}
