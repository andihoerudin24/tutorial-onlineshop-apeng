const User = require("../model/user");
const { validationResult } = require("express-validator");
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
exports.signup = (req, res, next) => {
  const errors = validationResult(req)
  if(!errors.isEmpty()){
      const error = new Error('Validation failed')
      error.statusCode = 422
      error.data = errors.array()
      throw error
  }
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  bcryptjs.hash(password,12).then((hashedPw) => {
       const user = new User({
           email:email,
           password:hashedPw,
           name:name
       })
       return user.save()
  })
  .then(result =>{
      res.status(201).json({
          message:'User Created',
          userId:result._id
      })
  })
  .catch((err) => {
    if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
  });
};


exports.login = (req,res,next) =>{
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser
    User.findOne({email:email})
    .then((user) => {
        if(!user){
            const error = new Error('A user with this email could not be found')
            error.statusCode = 401;
            throw error
        }
      loadedUser = user
      return bcryptjs.compare(password,user.password)
    })
    .then(isEqual=>{
        if(!isEqual){
            const error = new Error('Wrong password')
            error.statusCode = 401
            throw error
        }
        const token = jwt.sign({
            email:loadedUser.email,
            userId:loadedUser._id.toString()
        },'somesupersecretsecret',{
            expiresIn:'1h'
        })
        res.status(200).json({
            token : token,
            userId: loadedUser._id.toString()
        })
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500; 
      }
      next(err);
    });
}
