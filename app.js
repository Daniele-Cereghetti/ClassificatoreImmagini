const express = require('express')
const session = require('express-session')
const upload = require('express-fileupload')
const path = require('path');

const app = express()
const port = 3000

// requisito prossimo --> menu utente (reset password, ecc.)

app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, "images")))
app.use(express.static(path.join(__dirname, "style")))
app.use(express.static(path.join(__dirname, 'node_modules/bootstrap-icons/font/'), {
    setHeaders: function (res, path, stat) {
      if (path.endsWith('.css')) {
        // Set MIME type for CSS files to 'text/css'
        res.set('Content-Type', 'text/css');
      }
    }
}))
app.use(express.urlencoded({ extended : true, limit: '10mb' }))
app.use(session({
    secret : 'exsperandos',
    resave : false, 
    saveUninitialized : true,
    cookie: {} }))
app.use(upload())

const imgRouter = require('./routers/img')
const loginRouter = require('./routers/login')
const adminRouter = require('./routers/admin')
const userRouter = require('./routers/user')

app.use("/img", imgRouter)
app.use("/login", loginRouter)
app.use("/admin", adminRouter)
app.use("/user", userRouter)

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