const router=require('express').Router();
const verify = require('./verifyToken')

router.get('/',verify,(req,res)=>{
    // res.write('This a private route which is created to check that jsonwebtoken is completely work or not');
    res.send(req.user);
    
})

module.exports = router;