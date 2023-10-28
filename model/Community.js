const mongoose = require('mongoose');
const slugify= require('slugify')
const {Snowflake} =require("@theinternetfolks/snowflake");

const CommunitySchema = new mongoose.Schema({
    id:{
        type: String,
        unique: true,
        immutable: true
      },
    name:{
        type: String,
      required: [true, 'Please add a name'],
    },
    slug:String,
    owner:{
        type: String,
        ref: 'User',
        foreignField: 'id',
        required: true
      },

      
},{
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  })
  
CommunitySchema.pre('save',function(next){
    // console.log('Slug Name',this.name)\
    if (!this.id) {
        // Generate a Snowflake ID and set it in the document
        this.id = Snowflake.generate().toString();
      }
    this.slug=slugify(this.name,{lower:true})
    next()
  })
 
module.exports=mongoose.model('Community',CommunitySchema)