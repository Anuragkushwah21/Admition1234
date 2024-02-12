const express = require("express");
const FrontController = require("../controllers/FrontController");
const CourseController=require('../controllers/CourseController')
const AdminController=require('../controllers/AdminController')
const route = express.Router();
const checkUserAuth=require('../middleware/auth')

route.get("/", FrontController.login);
route.get("/about",checkUserAuth, FrontController.about);
route.get("/profile",checkUserAuth, FrontController.profile);
route.get("/register", FrontController.register);
route.get("/dashboard",checkUserAuth, FrontController.dashboard);
route.get("/course",checkUserAuth, FrontController.course);
route.get("/purchagepage",checkUserAuth, FrontController.purchagepage);
route.get("/contact",checkUserAuth, FrontController.contact);


//data insert
route.get("/logout", FrontController.logout);
route.post('/insertreg', FrontController.insertReg)
route.post('/vlogin', FrontController.vlogin)
 
//coursecontroller
route.post ('/courseinsert', checkUserAuth,CourseController.courseinsert)
route.get ('/course_display',checkUserAuth,CourseController.courseDisplay)
route.get ('/course_view/:id',checkUserAuth,CourseController.courseView)
route.get ('/course_edit/:id',checkUserAuth,CourseController.courseEdit)
route.get ('/course_delete/:id',checkUserAuth,CourseController.courseDelete)
route.post ('/course_update/:id',checkUserAuth,CourseController.courseUpdate)
// collen : id ke roop ko likhne ke liye

//update profile and password
route.post("/updateProfile",checkUserAuth, FrontController.updateProfile);
route.post("/updatePassword",checkUserAuth, FrontController.updatePassword);

//admincontroller
route.get("/admin/dashboard",checkUserAuth, AdminController.dashboard)
route.get("/admin/adminprofile",checkUserAuth, AdminController.AdminProfile)
route.post("/admin/update_status/:id",checkUserAuth, AdminController.update_status)


module.exports = route;
