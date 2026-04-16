"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function BookingButton({ roomId }: { roomId: number }) {
  const [loading, setLoading] = useState(false);

  const handleBooking = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId, customerName: "Guest User" }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`✅ Đặt phòng thành công!\nPhòng ID: ${roomId}\nBooking ID: ${data.bookingId}`);
        window.location.reload(); // Cập nhật lại trạng thái phòng trên màn hình
      } else {
        // Đây là nơi xử lý lỗi Pessimistic Locking hoặc phòng đã được đặt
        alert(`❌ Không thể đặt phòng: ${data.message}`);
      }
    } catch (error) {
      alert("❌ Lỗi kết nối đến Server Backend!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleBooking} 
      disabled={loading}
      className={`w-full font-bold py-2 rounded-lg transition-colors ${
        loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700 text-white"
      }`}
    >
      {loading ? "Đang xử lý..." : "Book Now"}
    </Button>
  );
}