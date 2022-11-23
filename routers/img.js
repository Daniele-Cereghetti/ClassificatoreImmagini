const express = require('express')
const router = express.Router()
const sqlite = require('sqlite3').verbose()

let db = new sqlite.Database(__dirname + '/../db/classimg.db')

router.get('/', checkAuthorization, (req,res)=>{
    getImages(function(img){
        res.render('img/index', { data : img})
    })
})

router.get('/upload', checkAuthorization, (req,res)=>{
    res.render('img/update')
})

router.post('/save', checkAuthorization, (req, res) => {
    if(req.files){
        //salvataggio immagine
        var file = req.files.img
        var t = (file.name).split('.')
        var ext = t[t.length-1]
        let d = new Date()
        let filename = d.getFullYear()+""+d.getMonth()+""+d.getDay()+""+d.getHours()+""+d.getMinutes()+""+d.getMilliseconds()
        file.mv('./images/'+filename+"."+ext, function(err){
            if(err){
                res.status(409).send(err)
            }else{
                res.redirect("/img")
            }
        })
        //salvataggio info immagini
        let sql = `INSERT INTO img VALUES (${filename}, '${req.body.nome}', ${req.body.prob})`
        db.run(sql)
    }else{
        res.send("nessun file")  
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
        res.render('img/index', { data : info})
    })
})


function getImages(callback){
    db.all("SELECT * FROM img", (err, rows)=>{
        let info = []
        rows.forEach((row) => {
            info.push([row.id+".jpg", row.nome, (row.probabilita * 100) + "%"])
        });
        callback(info)
    })
}

function checkAuthorization(req, res, next){
    if(req.cookies.authorized == 'true'){
        next();
    }else{
        res.status(403).redirect("/")
    }
}

module.exports = router