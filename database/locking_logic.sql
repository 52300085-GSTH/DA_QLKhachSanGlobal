-- KỊCH BẢN TEST: HAI NGƯỜI CÙNG ĐẶT PHÒNG ID = 1
-- Hướng dẫn: Mở 2 cửa sổ SQL (Session A và Session B)

-- ==========================================
-- TẠI SESSION A (Người dùng thứ nhất)
-- ==========================================
BEGIN;

-- Bước 1: Tìm và khóa phòng số 1 lại
SELECT * FROM Rooms WHERE ID = 1 FOR UPDATE; 
-- (Lúc này Session A đã nắm giữ chìa khóa của phòng 1)

-- Bước 2: Kiểm tra nếu thấy Status = 'AVAILABLE' thì tiến hành đặt
INSERT INTO Bookings (RoomID, GuestName) VALUES (1, 'Khách hàng A');

-- Bước 3: Cập nhật trạng thái phòng
UPDATE Rooms SET Status = 'BOOKED' WHERE ID = 1;

-- ĐỪNG COMMIT VỘI, hãy sang Session B để test thử...

-- ==========================================
-- TẠI SESSION B (Người dùng thứ hai - Chạy cùng lúc)
-- ==========================================
-- BEGIN;
-- SELECT * FROM Rooms WHERE ID = 1 FOR UPDATE; 
-- (BẠN SẼ THẤY: Session B bị treo/đứng yên, vì Session A đang khóa phòng này)

-- ==========================================
-- QUAY LẠI SESSION A
-- ==========================================
COMMIT; 
-- (Sau lệnh này, Session B mới thoát trạng thái treo và nhận được thông báo phòng đã BOOKED)