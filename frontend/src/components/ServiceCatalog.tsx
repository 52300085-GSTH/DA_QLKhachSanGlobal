"use client";

import { useQuery } from "@tanstack/react-query";
import { getTopRooms } from "@/services/api"; // Gọi hàm lấy dữ liệu của bạn
import HotelCard from "@/components/HotelCard";

export const ServiceCatalog = () => {
    // Dùng React Query để lấy dữ liệu từ Backend Docker của bạn
    const { data: rooms, isLoading } = useQuery({
        queryKey: ["top-rooms"],
        queryFn: getTopRooms,
    });

    if (isLoading) return <p>Đang tải danh sách phòng...</p>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {rooms?.map((room) => (
                <HotelCard key={room.roomid} room={room} />
            ))}
        </div>
    );
};