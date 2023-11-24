// https://www.sqlitetutorial.net/sqlite-nodejs/
const sqlite = require('sqlite3').verbose()

let db = new sqlite.Database('classimg.db')
let dev = true

db.serialize(()=>{
    db.run("DROP TABLE IF EXISTS usertype")
    db.run("DROP TABLE IF EXISTS user")
    db.run("DROP TABLE IF EXISTS img")
    db.run("DROP TABLE IF EXISTS report")
    console.log("Preparing enviroment ok")

    db.run("CREATE TABLE usertype (id INTEGER PRIMARY KEY, nome varchar(25))")
    db.run("CREATE TABLE user (id INTEGER PRIMARY KEY AUTOINCREMENT, email varchar(25) UNIQUE, username varchar(25) UNIQUE, password char(64), blocked BOOLEAN, type INTEGER, FOREIGN KEY (type) REFERENCES usertype(id))")
    db.run("CREATE TABLE img (id INTEGER PRIMARY KEY, nome varchar(50), probabilita double, user_id INTEGER, FOREIGN KEY (user_id) REFERENCES user(id))")
    db.run("CREATE TABLE report (id INTEGER PRIMARY KEY AUTOINCREMENT, time datetime, img_id INTEGER, user_id INTEGER, FOREIGN KEY (img_id) REFERENCES img(id), FOREIGN KEY (user_id) REFERENCES user(id))")
    console.log("Add Tables ok") // user_id, utente che ha fatto la segnalazione

    db.run("INSERT INTO usertype VALUES (1, 'admin')")
    db.run("INSERT INTO usertype VALUES (2, 'normal')")
    console.log("Add dafault user rules ok")

    db.run("INSERT INTO user VALUES (1, 'root@prova.ch', 'root', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', false, 1)")
    db.run("INSERT INTO user VALUES (2, 'user@prova.ch', 'user', '317b32c143692b9939c197f6a5df54f9698df9a4882fe8bf19608968662be4fa', false, 2)")
    console.log("Add default users ok")

    db.run("INSERT INTO img VALUES (2022931858634, 'robin, American robin, Turdus migratorius', 0.9275, 2)")
    db.run("INSERT INTO img VALUES (2022931859219, 'coho, cohoe, coho salmon, blue jack, silver salmon, Oncorhynchus kisutch', 0.8798999999999999, 2)")
    console.log("Add default imgs ok")
    
    if(dev){
        db.run("INSERT INTO user VALUES (3, 'roberto@prova.ch', 'roberto', '317b32c143692b9939c197f6a5df54f9698df9a4882fe8bf19608968662be4fa', false, 2)")
        db.run("INSERT INTO user VALUES (4, 'francesco@prova.ch', 'francesco', '317b32c143692b9939c197f6a5df54f9698df9a4882fe8bf19608968662be4fa', false, 2)")
        db.run("INSERT INTO user VALUES (5, 'geso@prova.ch', 'geso', '317b32c143692b9939c197f6a5df54f9698df9a4882fe8bf19608968662be4fa', false, 2)")
        db.run("INSERT INTO user VALUES (6, 'giorgia@prova.ch', 'giorgia', '317b32c143692b9939c197f6a5df54f9698df9a4882fe8bf19608968662be4fa', true, 2)")
        db.run("INSERT INTO user VALUES (99, 'test@test.ch', 'test', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', true, 1)")
        console.log("Add test users ok")

        db.run("INSERT INTO report VALUES (1, '2023-05-11 14:23:44',2022931858634, 2)")
        console.log("Add test reports ok")
    }
})

db.close()
console.log("---------------------")
console.log("DB created :)")