import Axios from "@/utils/Axios";
import { IServerCallback } from "./user.service";

class ItemService {
  //Actions on Raffle

  // Get All Items
  static getItems = async ({
    page,
    limit,
  }: {
    page: number;
    limit: number;
  }) => {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      const { data } = await Axios({
        url: `/raffle?${queryParams.toString()}`,
        method: "GET",
      });

      if (data.success) {
        return {
          ...data,
        };
      } else {
        throw new Error(data.message);
      }
    } catch (e: any) {
      const message =
        e?.response?.data?.error || e?.message || "Check console for error";
      throw new Error(message);
    }
  };
}

export default ItemService;
