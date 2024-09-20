import axiosClient from "./client";
import { IRegisterUser } from "@/Types/types";
import { AxiosError, AxiosResponse } from "axios";

export default async function registerUser(user: IRegisterUser): Promise<AxiosError | AxiosResponse> {
  try {
    return await axiosClient.post("register", user);
  } catch(e: any) {
    return e;
  }
}