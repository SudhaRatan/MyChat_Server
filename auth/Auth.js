const jwt = require('jsonwebtoken')

const verifyJWT = (req, res, next) => {
    const token = req.headers["auth-token"]
    if (!token) {
        res.send("no token!!!")
    } else {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                res.json({ auth: false, message: "Auth failed", err:err})
                
            } else {
                // console.log(decoded)
                req.userId = decoded._id
                next()
            }
        })
    }
}

module.exports = verifyJWT