const express = require('express')
const cookie = require('cookie-parser')
const upload = require('express-fileupload')

const app = express()
const port = 3000

// FARE: dropdown x log out

app.set('view engine', 'ejs')

app.use(express.static("images"))
app.use(express.static("style"))
app.use(express.urlencoded({ extended : true }))
app.use(cookie())
app.use(upload())

const imgRouter = require('./routers/img')
const loginRouter = require('./routers/login')

app.use("/img", imgRouter)
app.use("/login", loginRouter)

app.get('/', (req,res)=>{
    res.render('index')
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})