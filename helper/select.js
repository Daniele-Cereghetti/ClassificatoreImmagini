// https://www.sqlitetutorial.net/sqlite-nodejs/
const sqlite = require('sqlite3').verbose()

let db = new sqlite.Database('db/classimg.db')
let sql = "SELECT email, username, blocked, type FROM user"
db.all(sql,(err, row) => {
    if(err){
        console.log(err)
    }else{
        console.log(row)
    }
})

db.close()