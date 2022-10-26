const express = require('express')
const router = express.Router()
const fs = require('fs')
const crypt = require('crypto')

const dbUser = __dirname + "/../db/user.csv"
const secret = "fjash<e8z7e-.%&/"

router.post('/logon', (req,res)=>{
    if(!req.cookies.authorized){
        let user = req.body.username
        let passwd = req.body.passwd
        if(user && passwd){
            passwd = crypt.createHash('sha256', secret).update(passwd).digest('base64')
            getUser(user, passwd, function(usr){
                if(usr){
                    res.cookie('authorized', true)
                    res.cookie('username', user)
                    res.cookie('usrtype', 'normal')
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

router.post('/logout', (req,res)=>{
    if(req.cookies.authorized){
        res.cookie('authorized', false)
    }
})

function getUser(user, passwd, callback){
    fs.readFile(dbUser, function(err, data) {
        if(!err){
            let f = ""+data
            f = f.split("\n")
            let usr = undefined
            for(var i = 1; i < f.length; i++){
                if(f[i]){
                    let val = f[i].split(";")
                    val[2] = val[2].replace('\r', '')
                    if(val[1] == user && val[2] == passwd){
                        usr = val;
                    }
                }
            }
            callback(usr)
        }else{
            callback(undefined)
        }
    })
}


module.exports = router