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

router.post("/", async (req, res) => {
    const { email, password } = req.body;
    
    let user = await pool.query("SELECT password FROM tb_authorization WHERE email = $1", [email]);
    if (!user.rows[0]) return res.status(400).send('Invalid email or password.');

    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) return res.status(400).send('Invalid email or password.');
    res.status(200).send(true);
});

module.exports = router;