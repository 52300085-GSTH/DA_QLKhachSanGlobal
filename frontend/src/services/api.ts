const API_URL = 'http://localhost:5000/api';

export interface Room {
  hotelid: number;
  roomid: number;
  rate: string;
  rank: string;
}

export const getTopRooms = async (): Promise<Room[]> => {
  const res = await fetch(`${API_URL}/report/top-rooms`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch data');
  return res.json();
};