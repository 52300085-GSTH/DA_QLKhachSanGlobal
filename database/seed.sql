INSERT INTO Hotels (City) VALUES ('Hanoi'), ('Da Nang'), ('Ho Chi Minh');

INSERT INTO Rooms (HotelID, Rate, Status) VALUES 
(1, 100, 'AVAILABLE'), (1, 200, 'AVAILABLE'), 
(2, 150, 'AVAILABLE'), (3, 300, 'AVAILABLE');

-- Thêm khách sạn
INSERT INTO Hotels (City) VALUES ('Hanoi'), ('Da Nang'), ('Ho Chi Minh');

-- Thêm phòng với các trạng thái khác nhau
INSERT INTO Rooms (HotelID, Rate, Status) VALUES 
(1, 100.00, 'AVAILABLE'), 
(1, 200.00, 'AVAILABLE'), 
(2, 150.00, 'AVAILABLE'), 
(3, 300.00, 'BOOKED'); -- Phòng này đã có người đặt để test case lỗi

-- Thêm dữ liệu đặt phòng mẫu để sau này làm báo cáo Top Revenue
-- Giả sử phòng 4 đã mang lại doanh thu
INSERT INTO Bookings (RoomID, GuestName, BookingDate, CheckInDate, CheckOutDate, TotalPrice) 
VALUES (4, 'Nguyen Van A', '2024-01-15 10:00:00', '2024-02-01', '2024-02-05', 1200.00);