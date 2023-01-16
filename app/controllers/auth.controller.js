const db = require("../models");
const nodemailer = require("../config/nodemailer.config");
const config = require("../config/auth.config");
const User = db.user;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
  try {
    const token = jwt.sign({ email: req.body.email }, config.secret);
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      confirmationCode: token,
    });

      if (user) {
        
      nodemailer.sendConfirmationEmail(
        user.username,
        user.email,
        user.confirmationCode
      );
      
    res.send({ message: "User registered successfully!" });
      }
    } 
   catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.signin = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        username: req.body.username,
      },
    });

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!",
      });
    }

    if (user.status != "Active") {
      return res.status(401).send({
        message: "Pending Account. Please Verify Your Email!",
      });
    }

    const token = jwt.sign({ id: user.id }, config.secret);
    res.cookie("token", token, {
        expires: new Date(Date.now() + 600000),
        httpOnly: true,
      })
      

    return res.status(200).send({
      id: user.id,
      username: user.username,
      email: user.email,
      accessToken: token,
      status: user.status,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

exports.verifyUser = async (req, res, next) => {
 try{
  const user=await User.findOne({
    where:{
    confirmationCode: req.params.confirmationCode},
  })

    if(!user){
      return res.status(404).send({ message: "User Not found." });
    }
    user.status='Active';
  
    return res.status(200).send({message:"User Verified"});

}catch (error) {
  return res.status(500).send({ message: error.message });
}
};
