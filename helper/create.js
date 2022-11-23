// https://www.sqlitetutorial.net/sqlite-nodejs/
const sqlite = require('sqlite3').verbose()

let db = new sqlite.Database('classimg.db')
console.log("DB creato")

db.serialize(()=>{
    db.run("CREATE TABLE img (id INTEGER PRIMARY KEY, nome varchar(50), probabilita double)")
    db.run("CREATE TABLE user (id INTEGER PRIMARY KEY AUTOINCREMENT, username varchar(25), password char(64))")
    console.log("Tabelle create")
    db.run("INSERT INTO img VALUES (2022931858634, 'robin, American robin, Turdus migratorius', 0.9275)")
    db.run("INSERT INTO img VALUES (2022931859219, 'coho, cohoe, coho salmon, blue jack, silver salmon, Oncorhynchus kisutch', 0.8798999999999999)")
    console.log("Default img ok")
    db.run("INSERT INTO user VALUES (1, 'root', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918')")
    console.log("Default users ok")
})

db.close()
console.log("DB chiuso")