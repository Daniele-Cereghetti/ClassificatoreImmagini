const express = require('express')
const router = express.Router()
const crypt = require('crypto')
const { body, matchedData, validationResult } = require('express-validator');
const sqlite = require('sqlite3').verbose()
const checkAuthorization = require(__dirname + '/../modules/checkSession');

let db = new sqlite.Database(__dirname + '/../db/classimg.db')

router.get('/', checkAuthorization, (req,res)=>{
    getUserInfo(req.session.username, function(info){
        res.render("user/index",{data : info})
    })
})

router.post('/changeInfo', checkAuthorization, body('username','mail').notEmpty().trim().escape(), (req,res)=>{
    const result = validationResult(req);
    if (result.isEmpty()){
        let username = matchedData(req).username
        let mail = matchedData(req).mail
        setInfo(username, mail, req.session.username, (err) => {
            if(err){
                res.status(400).send(JSON.stringify({result: "Error"}))
            }else{
                req.session.username = req.body.username
                res.send(JSON.stringify({result: "ok"}))
            }
        })
    }else{
        res.status(400).send(JSON.stringify({result: "Error"}))
    }
})

router.post('/changePass', checkAuthorization, (req,res)=>{
    let passwd = crypt.createHash('sha256').update(req.body.newPass).digest('hex').toString()
    setPassword(passwd, req.session.username, (err)=>{
        if(err){
            res.status(400).send(JSON.stringify({result: "Error"}))
        }else{
            res.send(JSON.stringify({result: "ok"}))
        }
    })
})

function getUserInfo(username, callback){
    const sql = "SELECT email, username, type FROM user WHERE username = ?"
    db.get(sql, [username],(err, row)=>{
        callback(row)
    });
}

function setInfo(username, email, oldusername, callback){
    const sql = "UPDATE user SET username = ?, email = ? WHERE username = ?"
    db.run(sql, [username, email, oldusername], (data, err) => {
        callback(err)
    })
}

function setPassword(pass, username,callback){
    const sql = "UPDATE user SET password = ? WHERE username = ?"
    db.run(sql, [pass, username], (data, err) => {
        callback(err)
    })
}

module.exports = router