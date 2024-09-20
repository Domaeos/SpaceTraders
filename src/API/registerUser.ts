import axiosClient from "./client";
import { IUser } from "../Types/types";
import { AxiosError, AxiosResponse } from "axios";

export default async function registerUser(user: IUser): Promise<AxiosError | AxiosResponse> {
  try {
    const result = await axiosClient.post("register", user);
    return result;
  } catch(e: any) {
    return e;
  }
}