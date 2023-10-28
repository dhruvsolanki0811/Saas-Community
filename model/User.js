const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt=require('jsonwebtoken');
const {Snowflake} =require("@theinternetfolks/snowflake");


const UserSchema = new mongoose.Schema({
    id:{
        type: String,
        unique: true,
        immutable: true
      },
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false,
    },
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }  ,  
          toObject: {virtuals:true},
    
          toJSON: {virtuals:true} 
      
    }
    );


    // Encrypt password with decrypt js
    UserSchema.pre('save',async function(next){
        if (!this.isModified('password')) {
          next();
        }
        const salt= await bcrypt.genSalt(10)//recommended in docs
        this.password=await bcrypt.hash(this.password,salt)
        if (!this.id) {
          // Generate a Snowflake ID and set it in the document
          this.id = Snowflake.generate().toString();
        }
      })
  //match password
  UserSchema.methods.matchPassword=async function(enteredPassword){
    return bcrypt.compare(enteredPassword,this.password)
  }

    // Sign JWT and return
    UserSchema.methods.getSignedJwtToken = function () {
        return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRE,
        });
      };

      
module.exports=mongoose.model('User',UserSchema)