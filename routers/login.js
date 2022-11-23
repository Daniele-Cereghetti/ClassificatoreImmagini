const express = require('express')
const router = express.Router()
const crypt = require('crypto')
const sqlite = require('sqlite3').verbose()

let db = new sqlite.Database(__dirname + '/../db/classimg.db')

router.post('/logon', (req,res)=>{
    if(req.cookies.authorized != 'true'){
        let user = req.body.username
        let passwd = req.body.passwd
        if(user && passwd){
            passwd = crypt.createHash('sha256').update(passwd).digest('hex').toString()
            getUser(user, passwd, (usr) => {
                if(usr){
                    res.cookie('authorized', 'true')
                    res.cookie('username', user)
                    res.redirect("/img")
                }else{
                    res.render('index', {loginError: "Errore: username o password errati"})
                }
            })
        }else{
            res.render('index', {loginError: "Errore: Non tutti i campi sono stati riempiti"})
        }
    }else{
        res.redirect("/img")
    }
})

router.get('/logout', (req,res)=>{
    if(req.cookies.authorized){
        res.cookie('authorized', false)
    }
    res.redirect("/")
})

function getUser(user, passwd, callback){
    let sql = "SELECT * FROM user WHERE username = ? AND password = ?"
    db.get(sql, [user, passwd], (err, row) => {
        if(err || !row){
            callback(undefined)
        }else{
            callback(true)
        }
    })
}


module.exports = router