const Community = require('../model/Community')
const ErrorResponse= require('../utils/errorResponse')
const asyncHandler = require('../middleware/async');
//@desc     Create a Community
//@route    POST /api/v1/Community
//access    Protected
exports.createCommunity = asyncHandler(async (req, res, next) => {
    // Add user to req,body
    req.body.owner = req.user.id;
 
       
  
    const community = await Community.create(req.body);
  
    res.status(201).json({
  "status": true,
  "content": {
    "data": {
      "id": community.id,
      "name": community.name,
      "slug": community.slug,
      "owner": community.owner,
      "created_at":community.created_at,
      "updated_at": community.updated_at
    }
  }
    });
 
 });


 //@desc     Get all the Communtiy
//@route    GET /api/v1/Community
//access    Public
exports.getCommunities = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const count = await Community.countDocuments();
  const totalPages = Math.ceil(count / limit);
  const communities= await Community.find({},'-__v -_id').skip((page - 1) * limit)
  .limit(limit).populate({path:'owner',foreignField: 'id',select:'name -_id'})
  
  res.status(200).json({
        status:true,
        content:{
            meta:{
                total:count,
                pages:totalPages,
                page:page

            },
            data:communities
        }})
    
   
  });