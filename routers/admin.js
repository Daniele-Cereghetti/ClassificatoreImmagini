const express = require('express')
const router = express.Router()
const sqlite = require('sqlite3').verbose()

let db = new sqlite.Database(__dirname + '/../db/classimg.db')

router.get('/', checkAuthorization, (req,res)=>{
    res.render("admin/index")
})

router.get('/normal', checkAuthorization, (req,res)=>{
    res.render("admin/normal")
})

// richiesta ajax per cercare utenti
router.post('/normal/search', checkAuthorization, (req, res) => {
    let value = req.body.item
    getUser(value, (names) =>{
        res.send(JSON.stringify(names))
    })
})

// ajax request per blocco utente
// blocco così con quella email no nuovo account
router.post('/normal/block/', checkAuthorization, (req, res) => {
    let username = req.body.username
    blockUser(username, (result) =>{
        if(result == 0){
            res.send(JSON.stringify("ok"))
        }else{
            res.send(JSON.stringify("error"))
        }
    })
})

function getUser(val, callback){
    let sql = "SELECT id, email, username, blocked FROM user WHERE type = 2 AND "
    if(isNaN(val)){
        sql += `username LIKE '%${val}%'`
    }else{
        sql += "id = ?"
    }
    db.all(sql, (err, row) => {
        if(err || !row){
            callback(undefined)
        }else{
            callback(row)
        }
    })
}

function blockUser(username, callback){
    let sql = "UPDATE user SET blocked = NOT blocked WHERE type = 2 AND username = ?"
    db.run(sql, [username], (data, err) => {
        if(err){
            callback(1) // blocco non riuscito
        }else{
            callback(0) // blocco riuscito
        }
    })
}

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