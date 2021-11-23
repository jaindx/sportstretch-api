const express = require('express');
const router = express.Router();
const config = require('config');
const bcrypt = require('bcrypt');

const Pool = require('pg').Pool;
const pool = new Pool({
    connectionString: process.env.DATABASE_URL || config.get("connectionString"),
    ssl: {
        rejectUnauthorized: false
    }
}
);

router.post("/athlete", async (req, res) => {
    const { firstName, lastName, email, mobile, password } = req.body;
    
    let user = await pool.query("SELECT * FROM tb_authorization WHERE email = $1", [email]);
    if (user.rows[0]) return res.status(400).send('User already registered.');

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    user = await pool.query("INSERT INTO tb_authorization (email, password, role) VALUES ($1, $2, $3) RETURNING authorization_id", [email, hashed, "athlete"]);
    const newAthlete = await pool.query("INSERT INTO tb_athlete (fk_authorization_id, first_name, last_name, mobile) VALUES ($1, $2, $3, $4)", [user.rows[0].authorization_id, firstName, lastName, mobile]);
    
    res.status(200).send({
        firstName: firstName,
        lastName: lastName,
        email: email
    });
});

module.exports = router;