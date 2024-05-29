const UserModel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");
const CourseModel = require("../models/course");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dfoy70dri",
  api_key: "529319773434976",
  api_secret: "gnqQy8vKL-UAidGzN4WAp_5OZ2I",
});
class FrontController {
  static login = async (req, res) => {
    try {
      res.render("login", {
        msg: req.flash("success"),
        error: req.flash("error"),
      });
    } catch (error) {
      console.log(error);
    }
  };
  static about = async (req, res) => {
    try {
      const { name, image } = req.Userdata;
      res.render("about", { n: name, i: image });
    } catch (error) {
      console.log(error);
    }
  };
  static profile = async (req, res) => {
    try {
      const { name, image, email } = req.Userdata;
      res.render("profile", {
        n: name,
        i: image,
        e: email,
        msg: req.flash("success"),
        error: req.flash("error"),
      });
    } catch (error) {
      console.log(error);
    }
  };
  static register = async (req, res) => {
    try {
      res.render("register", { msg: req.flash("error") });
    } catch (error) {
      console.log(error);
    }
  };
  static dashboard = async (req, res) => {
    try {
      const { name, image, email, id } = req.Userdata;
      const btech = await CourseModel.findOne({ user_id: id, course: "btech" });
      const bca = await CourseModel.findOne({ user_id: id, course: "bca" });
      const mca = await CourseModel.findOne({ user_id: id, course: "mca" });
      // console.log(btech);
      res.render("dashboard", {
        n: name,
        i: image,
        e: email,
        btech: btech,
        bca: bca,
        mca: mca,
      });
    } catch (error) {
      console.log(error);
    }
  };
  static course = async (req, res) => {
    try {
      const { name, image } = req.Userdata;
      res.render("course", { n: name, i: image });
    } catch (error) {
      console.log(error);
    }
  };
  static contact = async (req, res) => {
    try {
      const { name, image } = req.Userdata;
      res.render("contact", { n: name, i: image });
    } catch (error) {
      console.log(error);
    }
  };
  static purchagepage = async (req, res) => {
    try {
      const { name, image } = req.Userdata;
      res.render("purchagepage", { n: name, i: image });
    } catch (error) {
      console.log(error);
    }
  };
  static logout = async (req, res) => {
    try {
      res.clearCookie("token");
      res.redirect("/");
    } catch (error) {
      console.log(error);
    }
  };
  //login registration
  static insertReg = async (req, res) => {
    try {
      // console.log(req.files.image)
      const file = req.files.image;
      //image upload
      const uploadImage = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "profile",
      });
      // console.log(uploadImage)
      // console.log('insert data')
      // console.log(req.body)
      const { n, e, p, cp } = req.body;
      const student = await UserModel.findOne({ email: e });
      if (student) {
        req.flash("error", "Email alredy exit");
        res.redirect("/register");
      } else {
        if (n && e && p && cp) {
          if (p == cp) {
            const hashpassword = await bcrypt.hash(p, 10);
            const result = new UserModel({
              name: n,
              email: e,
              password: hashpassword,
              image: {
                public_id: uploadImage.public_id,
                url: uploadImage.secure_url,
              },
            });
            const Userdata = await result.save();
            if (Userdata) {
              const token = jwt.sign(
                { ID: Userdata.id },
                "anuragkushwah15394584728655hgbdhjdn"
              );
              // console.log(token)
              res.cookie("token", token);
              this.sendVerifyEmail(n, e, Userdata._id);
              //to redirect to login
              // route url chalta h
            } else {
              req.flash(
                "success",
                "Registration Success plz verify your email!"
              );
              res.redirect("/");
            }
          } else {
            req.flash("error", "password and confirm password not same");
            res.redirect("/register");
          }
        } else {
          req.flash("error", "All field req");
          res.redirect("/register");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  static vlogin = async (req, res) => {
    try {
      // console.log(req.body)
      const { e, p } = req.body;
      if (e && p) {
        const user = await UserModel.findOne({ email: e });
        if (user != null) {
          const isMatched = await bcrypt.compare(p, user.password);
          if (isMatched) {
            if (user.role === "admin"&& user.is_varified==1) {
              const token = jwt.sign(
                { ID: Userdata.id },
                "anuragkushwah15394584728655hgbdhjdn"
              );
              // console.log(token)
              res.cookie("token", token);
              res.redirect("admin/dashboard");
            } else if(user.role === "user" && user.is_varified==1) {
              //token genrate

              const token = jwt.sign(
                { ID: user.id },
                "anuragkushwah15394584728655hgbdhjdn"
              );
              // console.log(token)
              res.cookie("token", token);
              res.redirect("/dashboard");
            }else{

              req.flash("error", "Plz verified Email Address");
              res.redirect("/"); 
            }
          } else {
            req.flash("error", "Email or Password is not valid");
            res.redirect("/");
          }
        } else {
          req.flash("error", "You are not a registred user");
          res.redirect("/");
        }
      } else {
        req.flash("error", "All Firlds Required");
        res.redirect("/");
      }
    } catch (error) {
      console.log(error);
    }
  };
  static sendVerifyEmail = async (name, email, user_id) => {
    // console.log(name,email,status,comment)
    // connenct with the smtp server

    let transporter = await nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,

      auth: {
        user: "anuragkofficial21@gmail.com",
        pass: "bjlgmcajfhsvpwwz",
      },
    });
    let info = await transporter.sendMail({
      from: "test@gmail.com", // sender address
      to: email, // list of receivers
      subject: ` For Varification mail`, // Subject line
      text: "heelo", // plain text body
      html:
        "<p>Hii " +
        name +
        ',Please click here to <a href="http://localhost:5000/verify?id=' +
        user_id +
        '">Verify</a>Your mail</p>.', // html body
    });
  };
  static verifyMail = async (req, res) => {
    try {
      const updateinfo = await UserModel.findByIdAndUpdate(req.query.id, {
        is_varified: 1,
      });
      if (updateinfo) {
        res.redirect("/dashboard");
      }
    } catch (error) {}
  };
  //update profile
  static updateProfile = async (req, res) => {
    try {
      const { id } = req.Userdata;
      const { name, email, image } = req.body;
      console.log(req.body);
      // console.log(req.files.image)
      if (req.files) {
        const user = await UserModel.findById(id);
        const imageID = user.image.public_id;
        //console.log(imageID)

        //deleting image from cloudinary

        await cloudinary.uploader.destroy(imageID);
        //new image update
        const imagefile = req.files.image;
        const imageupload = await cloudinary.uploader.upload(
          imagefile.tempFilePath,
          {
            folder: "profileImage",
          }
        );
        var data = {
          name: name,
          email: email,
          image: {
            public_id: imageupload.public_id,
            url: imageupload.secure_url,
          },
        };
      } else {
        var data = {
          name: name,
          email: email,
        };
      }
      await UserModel.findByIdAndUpdate(id, data);
      req.flash("success", "Profile Update successfully");
      res.redirect("/profile");
    } catch (error) {
      console.log(error);
    }
  };
  //change password
  static updatePassword = async (req, res) => {
    try {
      // console.log(req.body)
      const { op, np, cp } = req.body;
      const { id } = req.Userdata;
      if (op && np && cp) {
        const user = await UserModel.findById(id);
        const isMatched = await bcrypt.compare(op, user.password);
        console.log(isMatched);
        if (!isMatched) {
          req.flash("error", "Current password is incorrenct");
          res.redirect("/profile");
        } else {
          if (np != cp) {
            req.flash("error", "Password does not match");
            res.redirect("/profile");
          } else {
            const newHashPassword = await bcrypt.hash(np, 10);
            await UserModel.findByIdAndUpdate(id, {
              password: newHashPassword,
            });
            req.flash("success", "Password Update Successfully");
            res.redirect("/");
          }
        }
      } else {
        req.flash("error", "All fields are required");
        res.redirect("/profile");
      }
    } catch (error) {
      console.log(error);
    }
  };
  //forgot password
  static forgetPasswordVerify = async (req, res) => {
    try {
      const { email } = req.body;
      const userData = await UserModel.findOne({ email: email });
      //console.log(userData)
      if (userData) {
        const randomString = randomstring.generate();
        await UserModel.updateOne(
          { email: email },
          { $set: { token: randomString } }
        );
        this.sendEmail(userData.name, userData.email, randomString);
        req.flash("success", "Plz Check Your mail to reset Your Password!");
        res.redirect("/");
      } else {
        req.flash("error", "You are not a registered Email");
        res.redirect("/");
      }
    } catch (error) {
      console.log(error);
    }
  };
  //reset password
  static sendEmail = async (name, email, token) => {
    let transporter = await nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,

      auth: {
        user: "anuragkofficial21@gmail.com",
        pass: "bjlgmcajfhsvpwwz",
      },
    });
    let info = await transporter.sendMail({
      from: "test@gmail.com", // sender address
      to: email, // list of receivers
      subject: "Reset Password", // Subject line
      text: "hello", // plain text body
      html:
        "<p>Hii " +
        name +
        ',Please click here to <a href="http://localhost:5000/reset-password?token=' +
        token +
        '">Reset</a>Your Password.',
    });
  };
  static reset_Password = async (req, res) => {
    try {
      const token = req.query.token;
      const tokenData = await UserModel.findOne({ token: token });
      if (tokenData) {
        res.render("reset_password", { user_id: tokenData._id });
      } else {
        res.render("404");
      }
    } catch (error) {
      console.log(error);
    }
  };
  static reset_Password1 = async (req, res) => {
    try {
      const { password, user_id } = req.body;
      const newHashPassword = await bcrypt.hash(password, 10);
      await UserModel.findByIdAndUpdate(user_id, {
        password: newHashPassword,
        token: "",
      });
      req.flash("success", "Reset Password Updated successfully ");
      res.redirect("/");
    } catch (error) {
      console.log(error);
    }
  };
}
module.exports = FrontController;
