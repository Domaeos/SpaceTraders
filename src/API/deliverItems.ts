// import { logInDev } from "@/utils/logInDev";
// import axiosClient from "./client";
// import { ITradeGood } from "@/Types/types";

// export default async function deliverItems(shipSymbol: string, items: ITradeGood[]) {
//   try {
//     const url = `my/ships/${shipSymbol}/navigate`
//     await axiosClient.post(url, { waypointSymbol });
//     return { code: 200 }
//   } catch(e: any) {
//     logInDev(e);
//     return { code: e.response.data.error.code ?? 500 }
//   }
// }