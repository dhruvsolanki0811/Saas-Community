const User = require('../model/User');

const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const {Snowflake} =require("@theinternetfolks/snowflake");

// @desc      Create user
// @route     POST /api/v1/users
exports.createUser = asyncHandler(async (req, res, next) => {
    // const snowflakeId=Snowflake.generate().toString();
    const userData = {
        // id: snowflakeId,
        ...req.body,
        
      };
    const user = await User.create(userData);
    
    res.status(201).json({
      success: true,
    //   data: user
    content:{
        data:{
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "created_at": user.created_at
        }
    },
    meta:{
        "access_token": user.getSignedJwtToken()    
    }
    });
  });
 
  
//@desc     Login  user
//@route    Post /api/v1/auth/signin
//access    Public
exports.login=asyncHandler(async(req,res,next)=>{
    const {email,password}=req.body;
    if(!email || !password){
      return next(new ErrorResponse('Please provide email and password'),400)
        ;    
      }
    // Check for user
    const user = await User.findOne({ email }).select('+password');
   
    if (!user) {
        return next(new ErrorResponse('Invalid credentials', 401));
        ;
      }

    const isMatch= await user.matchPassword(password)
    
    if(!isMatch){
        return next(new ErrorResponse('Invalid credentials', 401));
        ;
    }
    const token= user.getSignedJwtToken()
    
    sendTokenResponse(user, 200, res);
})


// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();
  
    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };
    if(process.env.NODE_ENV=='production'){
        options.secure=true;
    }
    res.status(statusCode).cookie('token', token, options).json({
      success: true,
      content:{
        data:{
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "created_at": user.created_at
        }
    },
    meta:{
        "access_token": user.getSignedJwtToken()    
    }
    });
  };


  // @desc      Log user out / clear cookie
// @route     GET /api/v1/auth/logout
// @access    Public
exports.logout = asyncHandler(async (req, res, next) => {
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });
  
    res.status(200).json({
      success: true,
      data: {},
    });
  });




// @desc      Get current logged in user
// @route     get /api/v1/auth/me
// @access    Private
exports.getMe=asyncHandler(async (req,res,next)=>{
    const user = await User.findOne({id:req.user.id})
    res.status(200).json({success:true,
        content:{
            data:{
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "created_at": user.created_at
            }
        }})
  })