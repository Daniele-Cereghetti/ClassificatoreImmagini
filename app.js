const express = require('express')
const session = require('express-session')
const upload = require('express-fileupload')

const app = express()
const port = 3000

// FARE: admin foto page --> segnalazione da client,
//                           grafico degli utenti che ricevono e fanno segnalazioni in numeri (sia x utente che generale)
// requisito prossimo --> registrazione + reset password (mail)

app.set('view engine', 'ejs')

app.use(express.static("images"))
app.use(express.static("style"))
app.use(express.urlencoded({ extended : true }))
app.use(session({
    secret : 'exsperandos',
    resave : false, 
    saveUninitialized : true,
    cookie: {} }))
app.use(upload())

const imgRouter = require('./routers/img')
const loginRouter = require('./routers/login')
const adminRouter = require('./routers/admin')

app.use("/img", imgRouter)
app.use("/login", loginRouter)
app.use("/admin", adminRouter)

app.get('/', (req,res)=>{
    if(req.session.username){
        if(req.session.type == 1){
            res.redirect("/admin")
        }else{
            res.redirect("/img")
        }
    }else{
        res.render('index')
    }
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})