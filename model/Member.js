const mongoose = require('mongoose');
const {Snowflake} =require("@theinternetfolks/snowflake");

const MemberSchema = new mongoose.Schema({
    id:{
        type: String,
        unique: true,
        immutable: true
      },
      user:{
        type: String,
        ref: 'User',
        foreignField: 'id',
        required: true
      },
      community:{
        type: String,
        ref: 'Community',
        foreignField: 'id',
        required: true
      },
      role:{
        type: String,
        ref: 'Role',
        foreignField: 'id',
        required: true
      },
},{
    timestamps:{ createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
})
MemberSchema.pre('save',function(next){
    if (!this.id) {
        // Generate a Snowflake ID and set it in the document
        this.id = Snowflake.generate().toString();
      }
    next()
  })
  module.exports=mongoose.model('Member',MemberSchema)