import axiosClient from '@/API/client';

export default async function setDock(ship: string) {
  try {
    const url = `my/ships/${ship}/dock`;
    await axiosClient.post(url);
    return { code: 200 };
  } catch(e: any) {
    return { code: e.response.data.error.code ?? 500 }
  }
}