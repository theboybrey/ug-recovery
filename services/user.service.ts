import { FakeTokens, getFakeUser } from "@/models/faker";
import { getCookie, setCookie } from "typescript-cookie";

import Axios from "@/utils/Axios";
import { IRoles } from "@/models/roles.model";

export interface IServerCallback {
  (error: string | null, data?: any): void;
}

class UserService {
  static getUserInfo = async () => {
    try {
      //   const { data } = await Axios.get("/user/me");
      //   if (data.success) {
      //     return data.data;
      //   }

      const existingUser = getCookie("current_user");
      if (existingUser) {
        return JSON.parse(existingUser);
      }
      return getFakeUser();
    } catch (e: any) {
      console.log(`FETCH "user/me" error`, e);
      const message =
        e?.response?.data?.error || e?.message || "Check console for error";
      return message;
    }
  };

  static login = async (
    email: string,
    password: string,
    role: IRoles,
    callback: IServerCallback
  ) => {
    try {
      // const { data } = await Axios.post("/user/login", { phone, pin });
      // console.log("data", data);
      // if (data.success) {
      //     setCookie("access_token", data.data.access_token);
      //     setCookie("refresh_token", data.data.refresh_token);
      //     callback(null, data.data.user);
      // } else {
      //     callback(data.message)
      // }

      setCookie("access_token", FakeTokens.access_token);
      setCookie("refresh_token", FakeTokens.refresh_token);
      const user = getFakeUser({ email, role }, role);
      callback(null, user);
    } catch (e: any) {
      console.log(`FETCH "user/login" error`, e);
      const message =
        e?.response?.data?.error || e?.message || "Check console for error";
      callback(message);
    }
  };

  static getUsers = async ({
    page,
    limit,
  }: {
    page: number;
    limit: number;
  }) => {
    try {
      // const { data } = await Axios.get("/user", {
      //   params: { page, limit },
      // });
      // if (data.success) {
      //   return data.data;
      // }
      const users = Array.from({ length: limit }, (_, i) =>
        getFakeUser({
          _id: (page * limit + i + 1).toString(),
          name: `User ${page * limit + i + 1}`,
          email: `user${page * limit + i + 1}@example.com`,
        })
      );
      return {
        data: users,
        meta: {
          totalCount: 100, // Replace with actual total count
        },
      };
    } catch (e: any) {
      console.log(`FETCH "user" error`, e);
      const message =
        e?.response?.data?.error || e?.message || "Check console for error";
      return message;
    }
  };
}

export default UserService;
