const express = require('express');
const { body } = require("express-validator");
const authController = require('../controller/auth');
const router = express.Router()
const User = require('../model/user');

router.put('/signup',[
    body('email').isEmail().withMessage('Please Enter A valid email...')
    .custom((value,{req})=>{
       return User.findOne({
           email:value
       }).then((userDoc) => {
           console.log('userDodc',userDoc)
            if(userDoc){
                return Promise.reject('Email Alredy Exist')
            }
       })
    })
    .normalizeEmail(),
    body('password').trim().isLength({min:5}),
    body('name').trim().not().isEmpty()
],authController.signup);

router.post('/login',authController.login)

module.exports =  router