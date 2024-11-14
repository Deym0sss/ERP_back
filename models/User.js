const {Schema ,model} = require('mongoose')

const user = new Schema({
    email:{type:String, required:true , unique: true},
    password:{type:String, required:true },
    role:{type:String, required:true}

})


module.exports = model('User',user)