const {validationResult} =  require('express-validator')

exports.getPost = (req,res,next) => {
    res.status(200).json({
        posts:[
            {
                title:'First Post',
                content:'this is the first post!',
                imageUrl:'images/duck.jpg',
                creator:{
                    name:'Andi Hoerudin'
                },
                createdAt: new Date().toString()
            }
        ]
    })
}

exports.createPost = (req,res,next) =>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(422).json({
            message:'validation failed,entered data is incorect',
            errors:errors.array()
        })
    }
    const title = req.body.title
    const content = req.body.content
    res.status(200).json({
        message:'post created successfuly',
        post:{
            id: new Date().toISOString(),
            title:title,
            content:content,
            creator:{
                name:'Andi Hoerudin'
            },
            createdAt: new Date()
        }
    })
}