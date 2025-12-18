const express = require('express');
const router = express.Router();
const crypt = require('crypto');
const { body, matchedData, validationResult } = require('express-validator');
const sqlite = require('sqlite3').verbose();
const jwt = require('jsonwebtoken');
require('dotenv').config();

let db = new sqlite.Database(__dirname + '/../db/classimg.db');

// POST Login Route
router.post('/logon', body('username').notEmpty().trim().escape(), body('passwd').notEmpty().trim().escape(), (req, res) => {
    const result = validationResult(req);
    
    if (!result.isEmpty()) {
        return res.status(400).json({ loginError: 'Errore: Non tutti i campi sono stati riempiti' });
    }
    
    const data = matchedData(req);
    const user = data.username;
    const passwd = crypt.createHash('sha256').update(data.passwd).digest('hex').toString();

    getUser(user, passwd, (usr) => {
        if (usr) {
            if (usr.blocked == 0) {
                // Generate and sign a token
                const token = jwt.sign({
                    id: usr.id,
                    username: usr.username,
                    role: usr.type
                }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });

                // Respond with the token in an HttpOnly cookie
                res.cookie('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict'
                });

                res.status(200).json({ message: 'Accesso effettuato con successo!' });
            } else {
                res.status(403).json({ loginError: 'Errore: utente bloccato' });
            }
        } else {
            res.status(401).json({ loginError: 'Errore: username o password errati' });
        }
    });
});

function getUser(user, passwd, callback) {
    let sql = "SELECT id, username, blocked, type FROM user WHERE (username = ? OR email = ?) AND password = ?";
    db.get(sql, [user, user, passwd], (err, row) => {
        if (err || !row) {
            callback(undefined);
        } else {
            callback(row);
        }
    });
}

module.exports = router;