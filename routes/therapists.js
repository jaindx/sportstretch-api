const express = require('express');
const router = express.Router();
const config = require('config');

const us_states = require('../constants/us_states')

const Pool = require('pg').Pool;
const pool = new Pool({
    connectionString: process.env.DATABASE_URL || config.get("connectionString"),
    ssl: {
        rejectUnauthorized: false
    }
}
);

router.get("/", async (req, res) => {
    try {
        const allTherapists = await pool.query("SELECT * FROM tb_Therapist");
        res.json(allTherapists.rows);
    } catch (err) {
        console.log(err.message);
    }
});

router.get("/:state", async (req, res) => {
    try {
        const { state } = req.params;
        const stateName = us_states[state];
        const nearbyTherapists = await pool.query("SELECT * FROM tb_Therapist WHERE state = $1", [stateName]);
        res.json(nearbyTherapists.rows);
    } catch (err) {
        console.log(err.message);
    }
});

module.exports = router;