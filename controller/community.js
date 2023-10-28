const Community = require('../model/Community')
const Role = require('../model/Role')
const Member= require('../model/Member')

const ErrorResponse= require('../utils/errorResponse')
const asyncHandler = require('../middleware/async');
//@desc     Create a Community
//@route    POST /api/v1/Community
//access    Protected
exports.createCommunity = asyncHandler(async (req, res, next) => {
    // Add user to req,body
    req.body.owner = req.user.id;
    const role= await Role.findOne({'name':'Community Admin'})  

    const community = await Community.create(req.body);
    const member= await Member.create({community:community.id,role:role.id,user:req.user.id})
    
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


//@desc     Get all the Communtiy's Members
//@route    GET /api/v1/community/:id/members
//access    Public
exports.getCommunitiesMembers = asyncHandler(async (req, res, next) => {
const communityId=req.params.id;

const page = parseInt(req.query.page) || 1; // Page number
const limit = parseInt(req.query.limit) || 10;

const community=await Community.findOne({id:communityId})
if(!community){
  return next(new ErrorResponse('No Such Community'),400)
  ;
}

const members= await Member.find({community:communityId},'-_id -__v -updated_at   ').populate([
  {path:'user',foreignField: 'id',select:'name -_id'},
  {path:'role',foreignField: 'id',select:'name -_id'}
]).skip((page - 1) * limit).limit(limit).exec();

const totalMembers = await Member.countDocuments({ community: communityId });
const totalPages = Math.ceil(totalMembers / limit);

res.status(200).json({
  status:true,
  content:{
      meta:{
          total:totalMembers,
          pages:totalPages,
          page:page

      },
      data:members
  }})



})



//@desc     Get all the Owned Communtiy
//@route    GET /api/v1/community/me/owner
//access    Public
exports.getOwnedCommunities = asyncHandler(async (req, res, next) => {
  // req.user.id;

  const page = parseInt(req.query.page) || 1; // Page number
const limit = parseInt(req.query.limit) || 10;


  const communities= await Community.find({owner:req.user.id},'-_id -__v').skip((page - 1) * limit).limit(limit).exec()

  const totalMembers = await Community.countDocuments({ owner:req.user.id });
  const totalPages = Math.ceil(totalMembers / limit);
  res.status(200).json({
    status:true,
    content:{
        meta:{
            total:totalMembers,
            pages:totalPages,
            page:page
  
        },
        data:communities
    }})
  
})


//@desc     Get all the joined Communtiy
//@route    GET /api/v1/community/me/member
//access    Protected
exports.getJoinedCommunities = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1; // Page number
const limit = parseInt(req.query.limit) || 10;

    const members = await Member.find({ user: req.user.id }).populate({path:'community',foreignField: 'id',select:'-_id -__v'})
    .skip((page - 1) * limit) // Skip documents for previous pages
    .limit(limit);
    const communities = members.map(member => member.community);
    await Community.populate(communities, { path: 'owner', foreignField: 'id',select:'id name -_id' });

    const totalMembers = await Member.countDocuments({ user: req.user.id });

    const totalPages = Math.ceil(totalMembers / limit);
    
    res.status(200).json({
      status:true,
      content:{
          meta:{
              total:totalMembers,
              pages:totalPages,
              page:page
    
          },
          data:communities
      }})
})