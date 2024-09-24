import axiosClient from '@/API/client';

export default async function setOrbit(ship: string) {
  try {
    const url = `my/ships/${ship}/orbit`;
    const result = await axiosClient.post(url);
    return result.data.data.nav.status === "IN_ORBIT";
  } catch(e: any) {
    return false;
  }
}