-- 1. Tạo bảng theo đúng đề bài
CREATE TABLE Hotels (
    ID SERIAL PRIMARY KEY,
    City VARCHAR(100) NOT NULL
);

CREATE TABLE Rooms (
    ID SERIAL PRIMARY KEY,
    HotelID INT REFERENCES Hotels(ID),
    Rate DECIMAL(10, 2) NOT NULL,
    Status VARCHAR(20) DEFAULT 'AVAILABLE'
);

CREATE TABLE Bookings (
    ID SERIAL PRIMARY KEY,
    RoomID INT REFERENCES Rooms(ID),
    GuestName VARCHAR(100),
    BookingDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tạo bảng Log để lưu vết Trigger
CREATE TABLE RoomRateLogs (
    ID SERIAL PRIMARY KEY,
    RoomID INT,
    OldRate DECIMAL(10, 2),
    NewRate DECIMAL(10, 2),
    ChangeDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. SQL TRIGGER: Kiểm tra giá thay đổi > 50%
CREATE OR REPLACE FUNCTION func_check_rate_change()
RETURNS TRIGGER AS $$
BEGIN
    IF (ABS(NEW.Rate - OLD.Rate) / OLD.Rate) > 0.5 THEN
        INSERT INTO RoomRateLogs (RoomID, OldRate, NewRate)
        VALUES (OLD.ID, OLD.Rate, NEW.Rate);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_rate_audit
AFTER UPDATE OF Rate ON Rooms
FOR EACH ROW
EXECUTE FUNCTION func_check_rate_change();


ALTER TABLE Rooms ADD CONSTRAINT chk_status CHECK (Status IN ('AVAILABLE', 'BOOKED', 'MAINTENANCE'));

-- Bổ sung thông tin thời gian vào Bookings để tính doanh thu theo Quý (Quarter)
ALTER TABLE Bookings ADD COLUMN CheckInDate DATE;
ALTER TABLE Bookings ADD COLUMN CheckOutDate DATE;
ALTER TABLE Bookings ADD COLUMN TotalPrice DECIMAL(10, 2);