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

router.get("/all", async (req, res) => {
    try {
        const allTherapists = await pool.query("SELECT * FROM tb_therapist");
        res.status(200).json(allTherapists.rows);
    } catch (err) {
        console.log(err.message);
    }
});

router.get("/enabled/online", async (req, res) => {
    try {
        const state = req.query.state;
        if (state) {
            const stateName = us_states[state];
            const therapists = await pool.query("SELECT * FROM tb_therapist WHERE enabled = 1 and status = true and state = $1", [stateName]);
            res.status(200).json(therapists.rows);
        }
        else {
            const therapists = await pool.query("SELECT * FROM tb_therapist WHERE enabled = 1 and status = true");
            res.status(200).json(therapists.rows);
        }
    } catch (err) {
        console.log(err.message);
    }
});

module.exports = router;