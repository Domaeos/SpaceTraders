import axiosClient from '@/API/client';
import getSystem from '@/utils/getSystem';
import { logInDev } from '@/utils/logInDev';

export default async function fetchMarket(waypointSymbol: string) {
  try {
    const url = `systems/${getSystem(waypointSymbol)}/waypoints/${waypointSymbol}/market`;
    const result = await axiosClient.get(url);
    return result.data.data;
  } catch (e: any) {
    logInDev(e);
    return [];
  }
}