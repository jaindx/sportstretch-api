const express = require('express');
const router = express.Router();
const config = require('config');
const auth = require('../middleware/auth');

const Pool = require('pg').Pool;
const pool = new Pool({
    connectionString: process.env.DATABASE_URL || config.get("connectionString"),
    ssl: {
        rejectUnauthorized: false
    }
}
);

router.put("/:id", auth, async (req, res) => {
    try {
        const fk_bookings_id = parseInt(req.params.id, 10);
        const { starrating } = req.body;
        const rating = await pool.query("UPDATE tb_ratings SET starrating = $1 WHERE fk_bookings_id = $2", [starrating, fk_bookings_id]);
        res.status(200).json(rating.rows[0]);
    } catch (err) {
        console.log(err.message);
    }
});

router.post("/", auth, async (req, res) => {
    const { fk_bookings_id, fk_therapist_id, starrating } = req.body;
    const newRating = await pool.query("INSERT INTO tb_ratings (fk_bookings_id, fk_therapist_id, starrating) VALUES ($1, $2, $3)", [fk_bookings_id, fk_therapist_id, starrating]);
    res.status(201).send(`Rating added: ${newRating}`);
});

module.exports = router;