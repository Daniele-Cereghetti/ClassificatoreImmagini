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

// richiesta ajax per cercare utenti normali
router.post('/normal/search', checkAuthorization, (req, res) => {
    let value = req.body.item
    getUsers(value, (names) =>{
        res.send(JSON.stringify(names))
    })
})

// ajax request per blocco utente
// blocco così con quella email no nuovo account
router.post('/block', checkAuthorization, (req, res) => {
    let username = req.body.username
    blockUser(username,(result) =>{
        if(!result){
            res.send(JSON.stringify("ok"))
        }else{
            res.status(409).send(JSON.stringify("error"))
        }
    })
})

router.get('/super', checkAuthorization, (req,res)=>{
    getSuperUser((adms)=>{
        let usr = []
        adms.forEach(u => {
            if(u.username != req.session.username){
                usr.push(u);
            }
        });
        res.render('admin/super', {users: usr})
    })
})

function getUsers(val, callback){
    let sql = "SELECT id, email, username, blocked FROM user WHERE type = 2 AND username LIKE ?"
    db.all(sql, ['%'+val+'%'],(err, row) => {
        callback(row)
    })
}

function blockUser(username, callback){
    let sql = "UPDATE user SET blocked = NOT blocked WHERE username = ?"
    db.run(sql, [username], (data, err) => {
        callback(err)
    })
}

function getSuperUser(callback){
    let sql = "SELECT id, email, username, blocked FROM user WHERE type = 1"
    db.all(sql, (err, rows) => {
        if(err || !rows){
            callback(undefined)
        }else{
            callback(rows)
        }
    })
}

function checkAuthorization(req, res, next){
    if(req.session.username && req.session.type == 1){
        next();
    }else{
        res.status(403).redirect("/")
    }
}

module.exports = router