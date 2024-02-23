const express = require('express')
const router = express.Router()
const crypt = require('crypto')
const { body, matchedData, validationResult } = require('express-validator');
const sqlite = require('sqlite3').verbose()

let db = new sqlite.Database(__dirname + '/../db/classimg.db')

router.post('/logon', body('username').notEmpty().trim().escape(),body('passwd').notEmpty().trim().escape(), (req,res)=>{
    if(!req.session.username){
        const result = validationResult(req);
        if(result.isEmpty()){
            const data = matchedData(req);
            let user = data.username
            let passwd = crypt.createHash('sha256').update(data.passwd).digest('hex').toString()
            getUser(user, passwd, (usr) => {
                if(usr){
                    if(usr.blocked == 0){
                        req.session.userid = usr.id
                        req.session.type = usr.type
                        req.session.username = usr.username
                        res.redirect("/")
                    }else{
                        res.render('index', {loginError: "Errore: utente bloccato"})
                    }
                }else{
                    res.render('index', {loginError: "Errore: username o password errati"})
                }
            })
        }else{
            res.status(400).render('index', {loginError: "Errore: Non tutti i campi sono stati riempiti"})
        }
    }else{
        res.redirect("/img")
    }
})

router.get('/logout', (req,res)=>{
    if(req.session.username){
        req.session.destroy()
    }
    res.redirect("/")
})

function getUser(user, passwd, callback){
    let sql = "SELECT id, username, blocked,type FROM user WHERE (username = ? OR email = ?) AND password = ?"
    db.get(sql, [user, user,passwd], (err, row) => {
        if(err || !row){
            callback(undefined)
        }else{
            callback(row)
        }
    })
}


module.exports = router