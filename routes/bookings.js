const express = require('express');
const router = express.Router();
const config = require('config');

const Pool = require('pg').Pool;
const pool = new Pool({
    connectionString: process.env.DATABASE_URL || config.get("connectionString"),
    ssl: {
        rejectUnauthorized: false
    }
}
);

router.get("/pastBookings", async (req, res) => {
    try {
        const athleteId = parseInt(req.query.athleteId, 10);
        const query = "SELECT B.bookings_id, T.first_name, B.booking_time, B.confirmation_status, R.starrating FROM tb_bookings B JOIN tb_therapist T ON B.fk_therapist_id = T.therapist_id LEFT JOIN tb_ratings R ON B.bookings_id = R.fk_bookings_id WHERE B.fk_athlete_id = $1 and booking_time < (CURRENT_TIMESTAMP - interval '1 hour') and B.confirmation_status = 1";
        const pastBookings = await pool.query(query, [athleteId]);
        res.status(200).json(pastBookings.rows);
    } catch (err) {
        console.log(err.message);
    }
});

router.get("/upcomingBookings", async (req, res) => {
    try {
        const athleteId = parseInt(req.query.athleteId, 10);
        const query = "SELECT  B.bookings_id, T.first_name, B.booking_time, B.confirmation_status FROM tb_bookings B join tb_therapist T ON B.fk_therapist_id = T.therapist_id WHERE B.fk_athlete_id = $1 and booking_time >= (CURRENT_TIMESTAMP - interval '1 hour')";
        const upcomingBookings = await pool.query(query, [athleteId]);
        res.status(200).json(upcomingBookings.rows);
    } catch (err) {
        console.log(err.message);
    }
});

router.post("/", async (req, res) => {
    const { fk_athlete_id, athlete_location, fk_therapist_id } = req.body;
    const newBooking = await pool.query("INSERT INTO tb_bookings VALUES ($1, $2, $3)", [fk_athlete_id, athlete_location, fk_therapist_id]);
    res.status(201).send(`Booking added: ${newBooking}`);
});

module.exports = router;