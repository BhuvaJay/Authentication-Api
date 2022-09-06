const router=require('express').Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {registerValidation,loginValidation} = require('./validation');

//Route 1 :- Register for new users
router.post('/register', async (req,res) => {

    //lets validate the data before making a user
    const {error} = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //when user register fol we have to check that user is alredy register or not
    const emailExist = await User.findOne({email : req.body.email});
    if(emailExist) return res.status(400).send('Email already exists');

    //encrypt the password using bcryptjs module
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password,salt);

    //create a new user
    const user = new User({
        name:req.body.name,
        email:req.body.email,
        password:hashPassword
    });
    try {
        const savedUser = await user.save();
        res.send({user:user._id});
    } catch (err) {
        res.status(400).send(err);
    }
});

//Route 2 :- Login for alredy registered users
router.post('/login', async (req,res) => {
    //lets validate the data before making a user
    const {error} = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //Check that email is exist or not in DB or user is registered or not
    const user = await User.findOne({email : req.body.email});
    if(!user) return res.status(400).send('Email does not exist');

    //chech that password is correct or not
    const validPass = await bcrypt.compare(req.body.password,user.password);
    if(!validPass) return res.status(400).send("Invalid Password");

    //create and asign a token to the user
    const token = jwt.sign({_id : user._id},process.env.token_secret);
    res.header('auth-token' , token).send(token);//add token data to the header.
});


//Route 3 :- To get all Users details from Database
router.get('/register', async (req, res) => {
	try {
		const users = await User.find();
		res.json(users);
	} catch (error) {
		res.json(error);
	}
});


//Route 4 :- To delete user from Database
router.delete('/register/:userID', async (req, res) => {
	try {
		const deletedUser = await User.deleteOne({ _id: req.params.userID });
		res.json(deletedUser);
	} catch (error) {
		res.json({ message: error });
	}
});

module.exports = router;