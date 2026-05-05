const Joi = require("joi")
const { schema } = require("../Models/userModel")

const  RegisterUserValidation = (req,res,next) =>{
    const schema = Joi.object({
        name:Joi.string().min(4).max(50),
        email:Joi.string().min(4).max(50).email(),
        password:Joi.string().min(6).max(50)
    })

const {error} = schema.validate(req.body)
if(error){
   return res.status(400)
          .json({ message : "Bad Request",error})
}
  next()
}
const  LoginUserValidation = (req,res,next) =>{
    const schema = Joi.object({
        email:Joi.string().min(4).max(50).email(),
        password:Joi.string().min(6).max(50)
    })

const {error} = schema.validate(req.body)
if(error){
   return res.status(400)
          .json({ message : "Bad Request",error})
}
  next()
}

module.exports ={
                 RegisterUserValidation,
                 LoginUserValidation
                 }