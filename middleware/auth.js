const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../model/User');

exports.protect = asyncHandler(async (req, res, next) => {
    let token;
  
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      // Set token from Bearer token in header
      token = req.headers.authorization.split(' ')[1];
      // Set token from cookie
    }
    else if (req.cookies.token) {
      token = req.cookies.token;
    }
  
    // Make sure token exists
    if (!token) {
      return next(new ErrorResponse('Not authorized to access this route', 401));
    }
  
    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const idtofind=decoded.id.toString();
      req.user = await User.findOne({id:idtofind});
      console.log(req.user)
      next();
    } catch (err) {
      console.log("okay")
      return next(new ErrorResponse('Not authorized to access this route', 401));
    }
  });