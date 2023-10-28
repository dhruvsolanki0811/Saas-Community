const Role = require('../model/Role')
const asyncHandler = require('../middleware/async');

//@desc     Create a role
//@route    POST /api/v1/role
//access    Public
exports.createRole= asyncHandler(async (req, res, next) => {
    const role = await Role.create(req.body)
    res.status(201).json({
        "status": true,
        "content": {
          "data": {
            "id": role.id,
            "name": role.name,
            "created_at":role.created_at,
            "updated_at": role.updated_at
          }
        }
          });
})


//@desc     Get all roles
//@route    GET /api/v1/role
//access    Public
exports.getRoles= asyncHandler(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const count = await Role.countDocuments()    
  const totalPages = Math.ceil(count / limit);
    const roles= await Role.find().skip((page - 1) * limit).limit(limit)

    res.status(200).json({
        status:true,
        content:{
            meta:{
                total:count,
                pages:totalPages,
                page:page

            },
            data:roles
        }})
   
})
