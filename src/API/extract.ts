import axiosClient from '@/API/client';
import { logInDev } from '@/utils/logInDev';

export default async function extract(ship: string) {
  try {
    const url = `my/ships/${ship}/extract`;
    const result = await axiosClient.post(url);
    logInDev(result);
    return { code: 200 };
  } catch(e: any) {
    return { code: e.response.data.error.code ?? 500 }
  }
}