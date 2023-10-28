const { default: mongoose } = require("mongoose")
const ErrorResponse = require("./utils/errorResponse")

const errorHandler=(err,req,res,next)=>{    
    let error={...err}
    error.message= err.message
    //Mongoose bad object
    if(err.name==='CastError'){
        const message=`Resource not found with id ${err.value}`
        error= new ErrorResponse(message,404)
    }   
    
    //Mongoose duplicate key
    if(err.code===11000){
        const message=`Duplicate field value entered ie ${err.keyValue.name}`
        error= new ErrorResponse(message,400)
    }
    

    //Mongoose validation error
    if(err && err.name === 'ValidationError'){
        const message= Object.values(err.errors).map(val=>val.message)
        error= new ErrorResponse(message,400)
    }
    
    res.status(error.statusCode||500).json({
        success:false,
        error:error.message|| `Server error`
    })
}

module.exports= errorHandler