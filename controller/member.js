const Community = require('../model/Community')
const Role = require('../model/Role')
const Member= require('../model/Member')

const ErrorResponse= require('../utils/errorResponse')
const asyncHandler = require('../middleware/async');


//@desc     Create a member
//@route    POST /api/v1/member
//access    Protected Only Admin
exports.createMember = asyncHandler(async (req, res, next) => {
    const authUser=req.user.id;


    const community=await Community.findOne({id:req.body.community})

    //Is check admin
    if(community.owner!=authUser){
      return next(new ErrorResponse('Not Allowed Access'),405)
        ;
    }
    const role= await Role.findOne({'name':'Community Member'})
    const memberExist=await Member.findOne({community:community.id,user:req.body.user})
    if(memberExist){
      return next(new ErrorResponse('Already a member'),400)
      ;
    }

    const member= await Member.create({community:community.id,user:req.body.user,role:role.id})

    res.status(201).json({
  "status": true,
  "content": {
    "data": {
      "id": member.id,
      "community": member.community,
      "user":member.user ,
      "role": member.role,
      "created_at":community.created_at,
    }
  }
    });     

})

exports.removeMember=asyncHandler(async(req,res,next)=>{
    const authUser=req.user.id;
    const memberId=req.params.id;
    
    const member=await Member.findOne({id:memberId})
     if(!member){
      return next(new ErrorResponse('No Such Membership'),400)
        ;
     }
    const community=await Community.findOne({id:member.community})
   
    if(!community){
      return next(new ErrorResponse('No Such Membership'),400)
        ;
    }
    //Isadmin check 
    if(community.owner!=authUser){
      return next(new ErrorResponse('Not Allowed Access'),405)
        
    }

    await member.deleteOne()

    res.status(200).json({
        success: true,
      });


    
    
})