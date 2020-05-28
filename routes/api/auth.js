const express=require('express');
const router=express.Router();
const bcrypt=require('bcryptjs');
const auth=require('../../middleware/auth');
const User=require('../../models/User');
const config=require('config');
const {check, validationResult }= require('express-validator');
const jwt=require('jsonwebtoken');


router.get('/',auth,async (req,res) =>{
    try{
    const user =await User.findById(req.user.id).select('-password');// since it is a protected route and we are using
    //it in middleware token that's why we can use req.user.id
    res.json(user);
    }catch(err) {
     console.error(err.message)
     res.status(500).send('Server Error');
    }
} 
//res.send('Auth route')
);

//@route post api/auth
//@desc Authenticate user & get token
//@access public
router.post('/',[
    check('email','Please enter a valid email').isEmail(),
    check('password','Password is required').exists()
], 
async (req,res) => {
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array() });
    }
    const{email,password}=req.body;
    try{
     let user=await User.findOne({email});
     if(!user){
        return res.status(400).json({errors:[{msg:'Invalid Credentials'}]});
     }
     const isMatch=await bcrypt.compare(password,user.password);
     if(!isMatch)
     {
        return res.status(400).json({errors:[{msg:'Invalid Credentials'}]}); 
     }
     

        //get the payload
        const payload={
            user:{
                id:user.id  
            }
        }
        //sign the token
        jwt.sign(
            payload,
            config.get('jwtSecret'),
            {expiresIn:360000},
            (err,token)=>{
                if(err) throw err;
            res.json({token}); 
         })

       
    } catch(err){

    console.error(err.message);
    res.status(500).send('Server error');

    }
   // console.log(req.body);
     //res.send('user registered');
 });

module.exports=router;