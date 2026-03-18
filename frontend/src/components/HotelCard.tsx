import { Room } from "../services/api";

export default function HotelCard({ room }: { room: Room }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full">
          Hotel #{room.hotelid}
        </span>
        <span className="text-yellow-500 font-bold font-mono">Rank #{room.rank}</span>
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">Luxury Room {room.roomid}</h3>
      <p className="text-3xl font-black text-indigo-600 mb-4">
        ${room.rate} <span className="text-sm text-gray-400 font-normal">/night</span>
      </p>
      <button className="w-full bg-gray-900 text-white py-3 rounded-xl font-semibold group-hover:bg-indigo-600 transition-colors">
        Book Now
      </button>
    </div>
  );
}