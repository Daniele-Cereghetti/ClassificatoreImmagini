const express = require('express')
const router = express.Router()
const crypt = require('crypto')
const sqlite = require('sqlite3').verbose()

let db = new sqlite.Database(__dirname + '/../db/classimg.db')

router.get('/', checkAuthorization, (req,res)=>{
    res.render("admin/index")
})

router.get('/normal', checkAuthorization, (req,res)=>{
    res.render("admin/normal")
})

router.get('/super', checkAuthorization, (req,res)=>{
    res.render('admin/super')
})

function checkAuthorization(req, res, next){
    if(req.session.username && req.session.type == 1){
        next();
    }else{
        res.status(403).redirect("/")
    }
}

module.exports = router