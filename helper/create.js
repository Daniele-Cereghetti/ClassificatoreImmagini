// https://www.sqlitetutorial.net/sqlite-nodejs/
const sqlite = require('sqlite3').verbose()

let db = new sqlite.Database('classimg.db')

db.serialize(()=>{
    db.run("DROP TABLE IF EXISTS usertype")
    db.run("DROP TABLE IF EXISTS user")
    db.run("DROP TABLE IF EXISTS img")
    console.log("Cleared old data if they exists :)")

    db.run("CREATE TABLE usertype (id INTEGER PRIMARY KEY, nome varchar(25))")
    db.run("CREATE TABLE user (id INTEGER PRIMARY KEY AUTOINCREMENT, username varchar(25), password char(64), type INTEGER, FOREIGN KEY (type) REFERENCES usertype(id))")
    db.run("CREATE TABLE img (id INTEGER PRIMARY KEY, nome varchar(50), probabilita double)")
    console.log("Add Tables ok")

    db.run("INSERT INTO usertype VALUES (1, 'admin')")
    db.run("INSERT INTO usertype VALUES (2, 'normal')")
    console.log("Add dafault rules ok")

    db.run("INSERT INTO img VALUES (2022931858634, 'robin, American robin, Turdus migratorius', 0.9275)")
    db.run("INSERT INTO img VALUES (2022931859219, 'coho, cohoe, coho salmon, blue jack, silver salmon, Oncorhynchus kisutch', 0.8798999999999999)")
    console.log("Add default img ok")

    db.run("INSERT INTO user VALUES (1, 'root', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 1)")
    db.run("INSERT INTO user VALUES (2, 'user', '317b32c143692b9939c197f6a5df54f9698df9a4882fe8bf19608968662be4fa', 2)")
    console.log("Add default users ok")
})

db.close()
console.log("---------------------")
console.log("DB creato :)")