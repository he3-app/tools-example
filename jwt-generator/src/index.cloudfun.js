var jwt = require('jsonwebtoken');

function getJwtToken(
    {
        payload,
        secretOrPrivateKey,
        options,
    }

) {
    // console.log(arguments)
    if (secretOrPrivateKey.length === 0) return ''
    return jwt.sign(payload, secretOrPrivateKey, options)
}

module.exports = {
    getJwtToken
}