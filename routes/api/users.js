const express=require('express');
const router=express.Router();
const gravatar=require('gravatar');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const config=require('config');
const {check, validationResult }= require('express-validator')

const User=require('../../models/User');
router.post('/',[
    check('name','Name is required').not().isEmpty(),
    check('email','Please enter a valid email').isEmail(),
    check('password','Please enter password with 6 or more characters').isLength({ min:6})
], 
async (req,res) => {
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array() });
    }
    const{name,email,password}=req.body;
    try{
     let user=await User.findOne({email});
     if(user){
        return res.status(400).json({errors:[{msg:'User already exists'}]})
     }
     //get users gravatar
     const avatar=gravatar.url(email,
        {s:'200',// for size
        r:'pg',//for reading
        d:'mm'//for default

        })
        //create the user
        user=new User({
            name,
            email,
            avatar,
            password
        });
        //hash the password
        const salt=await bcrypt.genSalt(10);
        user.password=await bcrypt.hash(password,salt)
        //save the user in database
        await user.save();
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

module.exports = router;