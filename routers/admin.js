const express = require('express')
const router = express.Router()
const sqlite = require('sqlite3').verbose()
const fs = require('fs');

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
    blockUser(username,(err) =>{
        if(!err){
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

router.get('/foto', checkAuthorization, (req,res)=>{
    getImgReports((reps)=>{
        res.render('admin/foto', {reports: reps})
    })
})

//ajax eliminazione foto segnalata
router.post('/foto/del', checkAuthorization, (req, res) => {
    let id = req.body.rep_id
    deleteReport(id,(err) =>{
        if(!err){
            fs.unlink(__dirname+"/../images/"+id+".jpg", (error) => {
                if (error){
                    res.status(409).send(JSON.stringify("error"))
                }else{
                    res.send(JSON.stringify("ok"))
                }
            })
        }else{
            res.status(409).send(JSON.stringify("error"))
        }
    })
})

//ajax mantenimento foto segnalata
router.post('/foto/man', checkAuthorization, (req, res) => {
    let id = req.body.rep_id
    deleteReport(id, (err) =>{
        if(!err){
            res.send(JSON.stringify("ok"))
        }else{
            res.status(409).send(JSON.stringify("error"))
        }
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

function getImgReports(callback){
    let sql = "SELECT * FROM report"
    db.all(sql,(err, row) => {
        callback(row)
    })
}

function deleteReport(id, callback){
    let sql = "DELETE from report WHERE id = ?"
    db.run(sql, [id], (data, err) => {
        callback(err)
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