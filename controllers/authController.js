const { validationResult } = require('express-validator');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')


class AuthController {
     async registration(req, res){
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return res.status(400).json({errors: errors.array()});
            }

            const {email, password} = req.body;
            const candidate = await User.findOne({email});
            if (candidate){
                return res.status(400).json({message: "User already exist."});
            }
            const hashedPassword = await bcrypt.hash(password, 12);
            const user = new User({email, password:hashedPassword});
            await user.save();
            res.status(201).json({message: "User created."});
            
        } catch (error) {
            res.status(500).json({message: "Some error." });
        }
     }
     async login(req, res){
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                return res.status(400).json({errors: errors.array()})
            }

            const {email, password} = req.body;
            const user = await User.findOne({email});
            if(!user){
                res.status(400).json({message:'User wasn`t found'});
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if(!isMatch){
                return res.status(400).json({message:'Wrong password'});
            }
            const token = jwt.sign(
                {userId: user.id},
                process.env.SECRET_KEY,
                {expiresIn:'1h'}
            );
          
            res.json({ token, userId: user.id });





        } catch (error) {
            res.status(500).json({message: "Some error." });       
        }
     }
}

module.exports = new AuthController()