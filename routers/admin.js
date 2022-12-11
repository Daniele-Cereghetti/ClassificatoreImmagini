const express = require('express')
const router = express.Router()
const crypt = require('crypto')
const internal = require('stream')
const { type } = require('express/lib/response')
const { is } = require('express/lib/request')
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

function getUser(val, callback){
    let sql = "SELECT id, username FROM user WHERE type = 2 AND "
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