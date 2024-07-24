const CourseModel = require("../models/course");
class CourseController {
  static courseinsert = async (req, res) => {
    try {
      // console.log(req.body)
      // .create se image insert nhi ho pati h
      // const result =await CourseModel.create(req.body)
      const { name, email, phone, dob, address, gender, education, course } =
        req.body;
      // console.log(result)
      const result = new CourseModel({
        name: name,
        email: email,
        phone: phone,
        dob: dob,
        address: address,
        gender: gender,
        education: education,
        course: course,
        user_id: req.Userdata._id,
      });
      await result.save();
      res.redirect("/course_display");
    } catch (error) {
      console.log(error);
    }
  };
  static courseDisplay = async (req, res) => {
    try {
      const { name, image } = req.Userdata;
      const data = await CourseModel.find({ user_id: req.Userdata._id }); // userid find ke lie "{}" ye lgane pdte h
      // console.log(data)
      res.render("course/display", {
        d: data,
        n: name,
        i: image,
        msg: req.flash("success"),
      });
    } catch (error) {
      console.log(error);
    }
  };
  static courseView = async (req, res) => {
    try {
      const { name, image } = req.Userdata;
      // console.log(req.params.id)
      const data = await CourseModel.findById(req.params.id); //params id ko fatch krne ke lie
      // console.log(data)
      res.render("course/view", { d: data, n: name, i: image });
    } catch (error) {
      console.log(error);
    }
  };
  static courseEdit = async (req, res) => {
    try {
      const { name, image } = req.Userdata;
      // console.log(req.params.id)
      const data = await CourseModel.findById(req.params.id); //params id ko fatch krne ke lie
      // console.log(data)
      res.render("course/edit", { d: data, n: name, i: image });
    } catch (error) {
      console.log(error);
    }
  };
  static courseDelete = async (req, res) => {
    try {
      const data = await CourseModel.findByIdAndDelete(req.params.id); //params id ko fatch krne ke lie
      // console.log(data)
      req.flash("success", "Course Delete successfully");
      res.redirect("/course_display");
    } catch (error) {
      console.log(error);
    }
  };
  static courseUpdate = async (req, res) => {
    try {
      const { name, email, phone, dob, address, gender, education, course } =
        req.body;
      await CourseModel.findByIdAndUpdate(req.params.id, {
        name: name,
        email: email,
        phone: phone,
        dob: dob,
        address: address,
        gender: gender,
        education: education,
        course: course,
      }); //params id ko fatch krne ke lie
      // console.log(data)
      req.flash("success", "Course Update successfully");
      res.redirect("/course_display");
    } catch (error) {
      console.log(error);
    }
  };
}

module.exports = CourseController;
