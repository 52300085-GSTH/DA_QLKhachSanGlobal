"use client";
import { useQuery } from "@tanstack/react-query";
import { getTopRooms } from "../services/api";
import HotelCard from "./HotelCard";

export const ServiceCatalog = ({ bookingId }: { bookingId?: string }) => {
  const { data: rooms, isLoading } = useQuery({
    queryKey: ["top-rooms"],
    queryFn: getTopRooms,
  });

  if (isLoading) return <div className="p-10 text-center">Đang tải danh sách phòng...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {rooms?.map((room) => (
        <HotelCard key={`${room.hotelid}-${room.roomid}`} room={room} />
      ))}
    </div>
  );
};