// metodo che controlla che l'utente abbia una sessione attiva
module.exports = function checkAuthorization(req, res, next){
    if(req.session.username){
        next();
    }else{
        res.status(403).redirect("/")
    }
}