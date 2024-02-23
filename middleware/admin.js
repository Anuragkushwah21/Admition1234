const jwt=require("jsonwebtoken")

const authRoles =(roles)=>{  //roles admin bala aur role user bala
return(req,res,next)=>{
    if(!roles.includes(req.Userdata.role)){
        req.flash("error","Unauthorised user please login")
        res.redirect('/')
    }
    next()
}
}
module.exports=authRoles