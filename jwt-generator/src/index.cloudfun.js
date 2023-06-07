var jwt = require('jsonwebtoken');

function getJwtToken(
    {
        payload,
        secretOrPrivateKey,
        options,
    }

) {
    if (secretOrPrivateKey.length === 0) return ''
    return jwt.sign(payload, secretOrPrivateKey, options)
}

module.exports = {
    getJwtToken
}
