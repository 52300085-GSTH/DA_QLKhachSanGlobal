import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"; 

async function getRooms() {
  const res = await fetch('http://localhost:5000/api/report/top-rooms', { cache: 'no-store' });
  return res.json();
}

export default async function HomePage() {
  const rooms = await getRooms();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <header className="max-w-6xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Global Hotel Engine</h1>
        <p className="text-lg text-gray-600">Hệ thống báo cáo và đặt phòng thời gian thực, tích hợp SQL & NoSQL.</p>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room: any) => (
          <Card key={`${room.hotelid}-${room.id}-${room.rank}`} className="hover:shadow-lg transition-shadow border-t-4 border-t-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-600">Hotel #{room.hotelid}</CardTitle>
              <div className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">
                Rank #{room.rank}
              </div>
            </CardHeader>
            <CardContent>
              <h3 className="text-xl font-bold mb-2">Luxury Room {room.id}</h3>
              <p className="text-2xl font-black text-gray-900 mb-4">${room.rate} <span className="text-sm font-normal text-gray-500">/night</span></p>
              
              <div className="flex gap-2 mb-6">
                <span className="text-[10px] bg-gray-200 px-2 py-1 rounded">Wifi</span>
                <span className="text-[10px] bg-gray-200 px-2 py-1 rounded">Pool</span>
                <span className="text-[10px] bg-gray-200 px-2 py-1 rounded">Gym</span>
              </div>

              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition-colors">
                Book Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </main>
    </div>
  );
}