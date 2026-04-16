"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard() {
  const [reports, setReports] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState<any>(null); // Lưu dữ liệu lấy từ MongoDB
  const [roomId, setRoomId] = useState("");
  const [newPrice, setNewPrice] = useState("");

  // Thêm vào dưới dòng const [newPrice, setNewPrice] = useState("");
const [newRoom, setNewRoom] = useState({
  hotel_id: "",
  room_number: "",
  price: "",
  description: "",
  image_url: ""
});
const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

// Danh sách các tiện ích để chọn
const amenityOptions = ["Wifi", "Bữa sáng", "Giặt ủi", "Đưa đón tận nơi", "Hồ bơi", "Ban công"];

  const fetchReport = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/reports/top-rooms");
      setReports(res.data);
    } catch (err) { console.error("Lỗi lấy SQL:", err); }
  };

  // Hàm lấy dữ liệu từ MongoDB khi click vào Hotel
  const fetchHotelDetail = async (hotelId: number) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/hotels/${hotelId}`);
      setSelectedHotel(res.data);
    } catch (err) {
      alert("Khách sạn này chưa có dữ liệu chi tiết trong MongoDB!");
      setSelectedHotel(null);
    }
  };

  const handleUpdatePrice = async () => {
    if (!roomId || !newPrice) return alert("Nhập đủ ID và Giá!");
    try {
      await axios.put(`http://localhost:5000/api/rooms/${roomId}/price`, { newPrice: parseFloat(newPrice) });
      alert("Cập nhật thành công! Kiểm tra bảng RateChangeLog trong SQL nhé.");
      fetchReport();
    } catch (err) { alert("Lỗi cập nhật!"); }
  };

  const toggleAmenity = (name: string) => {
  setSelectedAmenities(prev =>
    prev.includes(name) ? prev.filter(a => a !== name) : [...prev, name]
  );
};

const handleCreateRoom = async () => {
  try {
    const payload = {
      ...newRoom,
      price: parseFloat(newRoom.price),
      hotel_id: parseInt(newRoom.hotel_id),
      amenities: selectedAmenities
    };
    
    await axios.post("http://localhost:5000/api/rooms/add-full", payload);
    alert("✨ Tạo phòng Hybrid thành công!");
    
    // Reset form
    setNewRoom({ hotel_id: "", room_number: "", price: "", description: "", image_url: "" });
    setSelectedAmenities([]);
    fetchReport(); // Load lại bảng SQL
  } catch (err) {
    alert("Lỗi khi thêm phòng mới!");
  }
};
const handleDelete = async (id: number) => {
  if (!window.confirm(`Bạn có chắc muốn xóa phòng ID: ${id} ở cả SQL và MongoDB không?`)) return;
  try {
    await axios.delete(`http://localhost:5000/api/rooms/${id}`);
    alert("🚀 Đã xóa sạch dữ liệu Hybrid!");
    fetchReport(); // Load lại bảng để mất dòng vừa xóa
    setSelectedHotel(null); // Xóa chi tiết bên cột phải nếu đang xem phòng đó
  } catch (err) {
    alert("Lỗi khi xóa phòng!");
    console.error(err);
  }
};

  useEffect(() => { fetchReport(); }, []);
const [editingRoom, setEditingRoom] = useState<any>(null); // Lưu phòng đang được sửa


// Hàm mở form sửa và nạp dữ liệu cũ vào
const startEdit = (item: any) => {
  setEditingRoom({
    room_id: item.room_id,
    hotel_id: item.hotel_id,
    price: item.price_per_night || 0,
    description: selectedHotel?.description || "",
    image_url: selectedHotel?.image_url || "",
    amenities: selectedHotel?.amenities || []
  });
};

// Hàm lưu dữ liệu sau khi sửa
const handleSaveUpdate = async () => {
  if (!editingRoom) return;

  // QUAN TRỌNG: Lấy ID từ object, ưu tiên cái nào có giá trị
  const targetId = editingRoom.id || editingRoom.room_id;

  try {
    // 1. Cập nhật SQL
    await axios.put(`http://localhost:5000/api/rooms/${targetId}/price`, { 
      newPrice: editingRoom.price_per_night || editingRoom.price 
    });
    
    // 2. Cập nhật NoSQL
    await axios.put(`http://localhost:5000/api/rooms/${targetId}/detail`, {
      description: editingRoom.description,
      image_url: editingRoom.image_url,
      amenities: editingRoom.amenities
    });

    alert("✅ Đã đồng bộ dữ liệu thành công!");
    setEditingRoom(null);
    fetchReport(); // Load lại bảng chính
    fetchPriceLogs(); // Load lại bảng Log
  } catch (err) {
    console.error(err);
    alert("Vẫn lỗi! Kiểm tra ID trong Console F12");
  }
};

// Thêm state để lưu log thay đổi giá phòng
const [priceLogs, setPriceLogs] = useState([]);

const fetchPriceLogs = async () => {
    try {
        const res = await axios.get("http://localhost:5000/api/rooms/price-logs/all");
        setPriceLogs(res.data);
    } catch (err) { console.error("Lỗi lấy log:", err); }
};

// Cập nhật lại useEffect để gọi hàm này khi trang load
useEffect(() => { 
    fetchReport(); 
    fetchPriceLogs(); // Thêm dòng này
}, []);

// Trong hàm handleSaveUpdate, sau khi alert thành công, hãy gọi lại fetchPriceLogs()
// để log mới nhất hiện lên ngay lập tức.

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-black">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-extrabold text-blue-900 mb-8 border-b-2 pb-2">Hệ Thống Quản Lý Hybrid (SQL & NoSQL)</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* CỘT TRÁI: DỮ LIỆU TỪ POSTGRESQL */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
              <h2 className="text-xl font-bold mb-4 text-blue-700">Top Doanh Thu (PostgreSQL)</h2>
              <div className="bg-slate-900 text-white p-6 rounded-xl shadow-xl mt-8 border border-slate-700">
                  <h2 className="text-xl font-bold mb-4 text-orange-400 flex items-center">
                    <span className="mr-2">📜</span> Nhật Ký Trigger (PostgreSQL)
                  </h2>
                  <div className="text-xs space-y-2 max-h-60 overflow-y-auto font-mono">
                    {priceLogs.map((log: any, index) => (
                      <div key={index} className="border-b border-slate-800 pb-2">
                        <p>
                          <span className="text-blue-400">[{new Date(log.change_date).toLocaleString()}]</span>
                          <span className="text-gray-300 ml-2">Phòng #{log.room_id}:</span> 
                          <span className="text-red-400 mx-2">${log.old_price}</span> 
                          <span className="text-gray-500">➜</span> 
                          <span className="text-green-400 ml-2">${log.new_price}</span>
                        </p>
                      </div>
                    ))}
                    {priceLogs.length === 0 && <p className="text-gray-500 italic">Chưa có thay đổi nào được ghi lại...</p>}
                  </div>
                </div>
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-100 text-sm uppercase text-gray-600">
                    <th className="p-3">Hạng</th>
                    <th className="p-3">Khách Sạn</th>
                    <th className="p-3">Phòng</th>
                    <th className="p-3">Doanh Thu</th>
                    <th className="p-3">Hành Động</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((item: any, i) => (
                    <tr key={i} 
                        onClick={() => fetchHotelDetail(item.hotel_id)}
                        className="border-b hover:bg-blue-50 cursor-pointer transition">
                      <td className="p-3 font-bold text-orange-500">#{item.rank}</td>
                      <td className="p-3 font-semibold text-blue-600 underline">Hotel {item.hotel_id}</td>
                      <td className="p-3 text-gray-600">Room {item.room_id}</td>
                      <td className="p-3 text-green-600 font-mono font-bold">${item.total_revenue || 0}</td>
                      <td className="p-3 flex gap-2 items-center"> 
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleDelete(item.room_id); }}
                            className="bg-red-100 text-red-600 px-3 py-1 rounded-md text-xs font-bold hover:bg-red-600 hover:text-white transition shadow-sm"
                          >
                            XÓA
                          </button>
                          
                          <button 
                            onClick={(e) => { e.stopPropagation(); startEdit(item); }}
                            className="bg-blue-100 text-blue-600 px-3 py-1 rounded-md text-xs font-bold hover:bg-blue-600 hover:text-white transition shadow-sm"
                          >
                            SỬA
                          </button>
                        </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-xs text-gray-400 mt-3 italic">* Click vào tên khách sạn để xem chi tiết từ NoSQL</p>
            </div>

            {/* FORM CẬP NHẬT GIÁ (TRIGGER) */}
            <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-orange-500">
              <h2 className="text-lg font-bold mb-4">Cập nhật giá & Test Trigger</h2>
              <div className="flex gap-3">
                <input type="number" placeholder="ID Phòng" className="border p-2 rounded w-1/4" value={roomId} onChange={(e)=>setRoomId(e.target.value)} />
                <input type="number" placeholder="Giá mới" className="border p-2 rounded w-1/2" value={newPrice} onChange={(e)=>setNewPrice(e.target.value)} />
                <button onClick={handleUpdatePrice} className="bg-orange-500 text-white px-4 py-2 rounded font-bold hover:bg-orange-600">Lưu</button>
              </div>
            </div>
            {/* FORM THÊM PHÒNG MỚI (HYBRID) */}
              <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-blue-600 mt-6">
                <h2 className="text-xl font-bold mb-4 text-blue-800">Thêm Phòng Chuyên Nghiệp (Hybrid)</h2>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <input type="number" placeholder="Hotel ID" className="border p-2 rounded" 
                    value={newRoom.hotel_id} onChange={(e)=>setNewRoom({...newRoom, hotel_id: e.target.value})} />
                  <input type="text" placeholder="Số phòng (Vd: 101)" className="border p-2 rounded" 
                    value={newRoom.room_number} onChange={(e)=>setNewRoom({...newRoom, room_number: e.target.value})} />
                  <input type="number" placeholder="Giá/Đêm" className="border p-2 rounded" 
                    value={newRoom.price} onChange={(e)=>setNewRoom({...newRoom, price: e.target.value})} />
                  <input type="text" placeholder="Link ảnh (URL)" className="border p-2 rounded" 
                    value={newRoom.image_url} onChange={(e)=>setNewRoom({...newRoom, image_url: e.target.value})} />
                </div>

                <textarea placeholder="Mô tả chi tiết phòng (Lưu vào MongoDB)..." className="w-full border p-2 rounded mb-4 h-24"
                  value={newRoom.description} onChange={(e)=>setNewRoom({...newRoom, description: e.target.value})} />

                <div className="mb-4">
                  <p className="text-sm font-semibold mb-2 text-gray-700">Tiện ích (Lưu vào MongoDB):</p>
                  <div className="grid grid-cols-3 gap-2">
                    {amenityOptions.map(item => (
                      <label key={item} className="flex items-center space-x-2 text-sm bg-gray-50 p-2 rounded border hover:bg-blue-50 cursor-pointer">
                        <input type="checkbox" checked={selectedAmenities.includes(item)} onChange={() => toggleAmenity(item)} />
                        <span>{item}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button onClick={handleCreateRoom} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition shadow-lg">
                  🚀 LƯU VÀO HỆ THỐNG HYBRID
                </button>
              </div>
          </div>
          

          {/* CỘT PHẢI: CHI TIẾT TỪ MONGODB */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 sticky top-8 h-fit">
            <h2 className="text-xl font-bold mb-4 text-purple-700 border-b pb-2">Thông Tin NoSQL (MongoDB)</h2>
            {selectedHotel ? (
              <div className="animate-fadeIn">
                <img src={selectedHotel.image_url} alt="Hotel" className="w-full h-56 object-cover rounded-lg mb-4 shadow" />
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Hotel ID: {selectedHotel.hotel_id}</h3>
                <p className="text-gray-600 leading-relaxed mb-4">{selectedHotel.description}</p>
                <div className="flex flex-wrap gap-2">
                  {selectedHotel.amenities.map((a: string, i: number) => (
                    <span key={i} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <p className="text-4xl mb-2">🏨</p>
                <p>Hãy chọn một khách sạn bên trái để lấy dữ liệu từ MongoDB</p>
              </div>
            )}
          </div>

        </div>
      </div>
        {editingRoom && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md text-black">
              <h2 className="text-xl font-bold mb-4 text-blue-800">Sửa Phòng #{editingRoom.room_id}</h2>
              
              <label className="block text-sm font-bold mb-1">Giá phòng (SQL):</label>
              <input type="number" className="w-full border p-2 rounded mb-3" 
                value={editingRoom.price} onChange={(e)=>setEditingRoom({...editingRoom, price: e.target.value})} />

              <label className="block text-sm font-bold mb-1">Mô tả (MongoDB):</label>
              <textarea className="w-full border p-2 rounded mb-3 h-24" 
                value={editingRoom.description} onChange={(e)=>setEditingRoom({...editingRoom, description: e.target.value})} />

              <label className="block text-sm font-bold mb-1">Link ảnh:</label>
              <input type="text" className="w-full border p-2 rounded mb-4" 
                value={editingRoom.image_url} onChange={(e)=>setEditingRoom({...editingRoom, image_url: e.target.value})} />

              <div className="flex gap-2">
                <button onClick={handleSaveUpdate} className="flex-1 bg-green-600 text-white py-2 rounded-lg font-bold">Lưu thay đổi</button>
                <button onClick={()=>setEditingRoom(null)} className="flex-1 bg-gray-200 py-2 rounded-lg font-bold">Hủy</button>
              </div>
            </div>
          </div>
          )}
    </div>
  );
}
