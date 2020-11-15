function authentication(req, res, next){

    next();
}

//checks token 
function tokenAuth(req, res, next){

}

function checkAuthorization(req, res, next){

    // if authorized then next() 
    // else send error
}

module.exports.auth = authentication;
module.exports.token = tokenAuth;
module.exports.authorize = checkAuthorization;