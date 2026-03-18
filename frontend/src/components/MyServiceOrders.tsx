export const MyServiceOrders = ({ bookingId }: { bookingId?: string }) => {
  return (
    <div className="p-8 border-2 border-dashed border-slate-200 rounded-2xl text-center">
      <h3 className="text-lg font-semibold text-slate-700">Đơn đặt của tôi</h3>
      <p className="text-slate-500">Booking ID: {bookingId || "Chưa có đơn hàng nào"}</p>
    </div>
  );
};