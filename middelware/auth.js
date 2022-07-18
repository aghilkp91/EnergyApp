const $jwt = require('jsonwebtoken');

const $Auth = (req, res, next) => {
    const $token = req.headers.authorization;
    if(req.headers.authorization === "EnergyAppAdmin") {
        next();
    }
    else if (req.headers.authorization === "") {
        console.log(`Error: you missed the token`);
        res.status(409).json({
            Error: {
                message: `token must be provided!`
            }
        });
    } else {
        try {
            const $decoded = $jwt.verify($token, "EnergyApp");
            req.userData = $decoded;
            next();
        } catch (error) {
            console.log(`Error: ${error.message}`);
            res.status(409).json({
                message: `Auth failed! You must be logged in first!`,
                Error: {
                    error: error.message
                }
            });
        }
    }
};

module.exports = $Auth;