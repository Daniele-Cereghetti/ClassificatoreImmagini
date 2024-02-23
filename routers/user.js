const express = require('express')
const router = express.Router()
const crypt = require('crypto')
const sqlite = require('sqlite3').verbose()
const checkAuthorization = require(__dirname + '/../modules/checkSession');

let db = new sqlite.Database(__dirname + '/../db/classimg.db')

router.get('/', checkAuthorization, (req,res)=>{
    getUserInfo(req.session.username, function(info){
        if(info.type == "2"){
            res.render("user/normal",{data : info})
        }else{
            res.render('user/admin', {data : info})
        }
    })
})

router.post('/changeInfo', checkAuthorization, (req,res)=>{
    res.send(JSON.stringify({result: "ok"}))
})

router.post('/changePass', checkAuthorization, (req,res)=>{
    res.send(JSON.stringify({result: "ok"}))
})

function getUserInfo(username, callback){
    const sql = "SELECT email, username, type FROM user WHERE username = ?"
    db.get(sql, [username],(err, row)=>{
        callback(row)
    });
}

module.exports = router