const express = require('express')
const router = express.Router()
const checkAuthorization = require(__dirname + '/../modules/checkSession');
const { body, matchedData, validationResult } = require('express-validator');
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
router.post('/normal/search', checkAuthorization, body('item').notEmpty().trim().escape(), (req, res) => {
    const result = validationResult(req);
    if (result.isEmpty()){
        let value = matchedData(req).item;
        getUsers(value, (names) =>{
            res.send(JSON.stringify(names))
        })
    }else{
        res.status(404).send(JSON.stringify({}))
    }
})

// ajax request per blocco utente
// blocco così con quella email no nuovo account
router.post('/block', checkAuthorization, body('username').notEmpty().trim().escape(),(req, res) => {
    const result = validationResult(req);
    if (result.isEmpty()){
        let val = matchedData(req).username;
        blockUser(val,(err) =>{
            if(!err){
                res.send(JSON.stringify("ok"))
            }else{
                res.status(404).send(JSON.stringify("error"))
            }
        })
    }else{
        res.status(404).send(JSON.stringify("error"))
    }
    
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
router.post('/foto/del', checkAuthorization, body('rep_img_id').notEmpty().trim().escape(), (req, res) => {
    const result = validationResult(req);
    if (result.isEmpty()){
        let id = matchedData(req).rep_img_id;
        deleteReport(id,(err) =>{
            if(!err){
                deleteImg(id, (errImg)=>{
                    if(!errImg){
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
            }else{
                res.status(409).send(JSON.stringify("error"))
            }
        })
    }else{
        res.status(404).send(JSON.stringify("error"))
    }
})

//ajax mantenimento foto segnalata
router.post('/foto/man', checkAuthorization, body('rep_img_id').notEmpty().trim().escape(), (req, res) => {
    const result = validationResult(req)
    if (result.isEmpty()){
        let id = matchedData(req).rep_img_id
        deleteReport(id, (err) =>{
            if(!err){
                res.send(JSON.stringify("ok"))
            }else{
                res.status(409).send(JSON.stringify("error"))
            }
        })    
    }else{
        res.status(404).send(JSON.stringify("error"))
    }
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
    let sql = "SELECT report.img_id, report.time, report.user_id, user.username as report_from FROM report LEFT JOIN user ON user.id=report.user_id"
    let result = []
    db.all(sql,(err, rows) => {
        rows.forEach(rep =>{
            sql = "SELECT user.username as name FROM user WHERE id = (select user_id from img where id = ?)"
            db.get(sql, [rep.img_id], (err, user)=>{
                result.push({img_id: rep.img_id, time: rep.time, report_from: rep.report_from, user_img: user.name})
            });
        });
    })
    setTimeout(()=>{
        callback(result)
    }, 250)
}


function deleteImg(id, callback){
    let sql = "DELETE from img WHERE id = ?"
    db.run(sql, [id], (data, err) => {
        callback(err)
    })
}

function deleteReport(id, callback){
    let sql = "DELETE from report WHERE img_id = ?"
    db.run(sql, [id], (data, err) => {
        callback(err)
    })
}


module.exports = router