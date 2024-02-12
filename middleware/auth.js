const jwt=require('jsonwebtoken')
const UserModel=require('../models/user')

const checkUserAuth=async(req,res,next)=>{
    // console.log("middleware auth")
    const {token}=req.cookies; //token get
    // console.log(token)
    if(!token){
        req.flash('error','Unaouthrized Login')
        res.redirect('/')

    }else{
        const data =jwt.verify(token,'anuragkushwah15394584728655hgbdhjdn')
        //get data
        const Userdata=await UserModel.findOne({_id:data.ID});
        // console.log(Userdata)
        req.Userdata=Userdata
        next();
    }
}

module.exports=checkUserAuth