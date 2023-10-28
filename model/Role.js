const mongoose = require('mongoose');
const {Snowflake} =require("@theinternetfolks/snowflake");

const RoleSchema = new mongoose.Schema({
    id:{
        type: String,
        unique: true,
        immutable: true
      },
    name:{
        type: String,
        unique:true,
      required: [true, 'Please add a name'],
      enum: ['Community Member', 'Community Admin'], // Set default values
    }
},{
    timestamps:true
})

RoleSchema.pre('save',function(next){
    // console.log('Slug Name',this.name)\
    if (!this.id) {
        // Generate a Snowflake ID and set it in the document
        this.id = Snowflake.generate().toString();
      }
    next()
  })

  module.exports=mongoose.model('Role',RoleSchema)