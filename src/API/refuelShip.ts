import axiosClient from '@/API/client';

export default async function refuelShip(ship: string) {
  try {
    const url = `my/ships/${ship}/refuel`;
    await axiosClient.post(url);
    return { code: 200 };
  } catch(e: any) {
    return { code: e.response.data.error.code ?? 500 }
  }
}