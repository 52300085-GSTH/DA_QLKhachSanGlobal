const pgPool = require('../config/db');

exports.getTopRoomsReport = async (req, res) => {
    try {
        const query = `
            WITH RoomRevenue AS (
                SELECT 
                    r.id AS room_id,
                    r.hotel_id,
                    r.price_per_night,
                    COALESCE(SUM(b.amount), 0) as total_revenue
                FROM rooms r
                LEFT JOIN bookings b ON r.id = b.room_id
                GROUP BY r.id, r.hotel_id, r.price_per_night
            )
            SELECT * FROM (
                SELECT 
                    room_id,
                    hotel_id,
                    total_revenue,
                    DENSE_RANK() OVER (PARTITION BY hotel_id ORDER BY total_revenue DESC) as rank
                FROM RoomRevenue
            ) ranking_table
            WHERE rank <= 3;
        `;

        const result = await pgPool.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error('❌ Report Error:', err.message);
        res.status(500).json({ error: "Lỗi truy vấn SQL: " + err.message });
    }
};