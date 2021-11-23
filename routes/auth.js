const express = require('express');
const router = express.Router();
const config = require('config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Pool = require('pg').Pool;
const pool = new Pool({
    connectionString: process.env.DATABASE_URL || config.get("connectionString"),
    ssl: {
        rejectUnauthorized: false
    }
}
);

router.post("/", async (req, res) => {
    const { email, password } = req.body;
    
    let user = await pool.query("SELECT password, role, authorization_id FROM tb_authorization WHERE email = $1", [email]);
    if (!user.rows[0]) return res.status(400).send('Invalid email or password.');

    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) return res.status(400).send('Invalid email or password.');

    let userObj = null;
    if (user.rows[0].role === "athlete") {
        const athlete = await pool.query("SELECT athlete_id, first_name, last_name, mobile FROM tb_athlete WHERE fk_authorization_id = $1", [user.rows[0].authorization_id]);
        userObj = {
            athlete_id : athlete.rows[0].athlete_id,
            first_name : athlete.rows[0].first_name,
            last_name : athlete.rows[0].last_name,
            mobile: athlete.rows[0].mobile
        }
    }
    else if (user.rows[0].role === "therapist") {
        //populate userObj accordingly
    }
    else if (user.rows[0].role === "admin") {
        //populate userObj accordingly
    }

    const authResObj = {
        role : user.rows[0].role,
        userObj: userObj
    }

    const token = jwt.sign(authResObj, process.env.jwtPrivateKey || config.get("jwtPrivateKey"));
    res.status(200).send(token);
});

module.exports = router;