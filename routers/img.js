const express = require('express')
const router = express.Router()
const sqlite = require('sqlite3').verbose()

let db = new sqlite.Database(__dirname + '/../db/classimg.db')

router.get('/', checkAuthorization, (req,res)=>{
    getImages(function(img){
        res.render('page', { content: 'img/index', title: 'home', namePage: 'Images', data : img})
    })
})

router.get('/upload', checkAuthorization, (req,res)=>{
    res.render('page', { content: 'img/update', title: 'Upload', namePage: 'Upload img'})
})

router.post('/save', checkAuthorization, (req, res) => {
    if(req.files){
        var file = req.files.img
        let d = new Date()
        let filename = d.getFullYear()+""+d.getMonth()+""+d.getDay()+""+d.getHours()+""+d.getMinutes()
        filename = filename + Math.floor(Math.random() * 100000)
        file.mv('./images/'+filename+".jpg", function(err){
            if(err){
                res.render('page', { 
                    content: 'img/update', title: 'Upload', namePage: 'Upload img',
                    err: "Errore durante l'upload dell'immagine, riprovare"
                })
            }else{
                res.redirect("/img")
            }
        })
        let sql = `INSERT INTO img VALUES (${filename},'${req.body.nome}', ${req.body.prob}, ${req.session.userid})`
        db.run(sql)
    }else{
        res.render('page', {
            content: 'img/update', title: 'Upload', namePage: 'Upload img',
            err: "Nessun file caricato, non fare il furbo ;)"
        })
    }
})

router.post('/search', checkAuthorization, (req,res)=>{
    let ask = req.body.itemasked
    getImages(function(img){
        let info = []
        for(var i = 0; i < img.length; i++){
            if(img[i]){
                if(img[i][1].includes(ask)){
                    info.push(img[i])
                }
            }
        }
        res.render('page', { content: 'img/index', title: 'home', namePage: 'Images', data : info})
    })
})


function getImages(callback){
    const sql = "SELECT img.id, img.nome, img.probabilita, user.username FROM img INNER JOIN user ON img.user_id = user.id"
    db.all(sql, (err, rows)=>{
        let info = []
        rows.forEach((row) => {
            info.push([row.id+".jpg", row.nome, (row.probabilita * 100) + "%", row.username])
        });
        callback(info)
    })
}

function checkAuthorization(req, res, next){
    if(req.session.username){
        next();
    }else{
        res.status(403).redirect("/")
    }
}

module.exports = router