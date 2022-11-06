const express = require('express')
const router = express.Router()
const fs = require('fs')

const dbImg = __dirname + "/../db/img.csv"

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
        let record = filename+";"+req.body.nome+";"+req.body.prob+"\n"
        fs.appendFile(dbImg, record, function (err) {
            if (err) throw err;
        });
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

//metodo che ritorna immagini
// array vouto -> no img o no file
function getImages(callback){
    fs.readFile(dbImg, function(err, data) {
        if(!err){
            let f = ""+data
            f = f.split("\n")
            let info = []
            for(var i = 1; i < f.length; i++){
                if(f[i]){
                    let val = f[i].split(";")
                    val[0] = val[0]+".jpg"
                    val[2] = (val[2] * 100) + "%"
                    info.push(val)
                }
            }
            callback(info)
        }else{
            callback([])
        }
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