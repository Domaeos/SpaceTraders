import axiosClient from "./client";

export default async function fetchFactions() {
  try {
    const factions = await axiosClient.get("/factions");
    return factions;
  } catch(e: unknown) {
    console.log(e);
  }
}