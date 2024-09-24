import axiosClient from '@/API/client';

export default async function setOrbit(ship: string) {
  try {
    const url = `my/ships/${ship}/orbit`;
    await axiosClient.post(url);
    return { code: 200 }
  } catch (e: any) {
    return { code: e.response.data.error.code ?? 500 }
  }
}