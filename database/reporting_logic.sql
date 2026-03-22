-- TRUY VẤN TOP 3 PHÒNG DOANH THU CAO NHẤT MỖI KHÁCH SẠN
-- Sử dụng Window Function: DENSE_RANK()

SELECT 
    HotelID,
    RoomID,
    TotalRevenue,
    RevenueRank
FROM (
    SELECT 
        r.HotelID,
        r.ID AS RoomID,
        SUM(r.Rate) AS TotalRevenue, -- Tính tổng doanh thu
        DENSE_RANK() OVER (
            PARTITION BY r.HotelID 
            ORDER BY SUM(r.Rate) DESC
        ) AS RevenueRank -- Xếp hạng doanh thu trong từng khách sạn
    FROM Rooms r
    JOIN Bookings b ON r.ID = b.RoomID
    GROUP BY r.HotelID, r.ID
) AS RankedRooms
WHERE RevenueRank <= 3; -- Chỉ lấy Top 3
