import ItemService from "@/services/item.service";
import { useQuery } from "@tanstack/react-query";

export const useItems = ({ page, limit }: { page: number; limit: number }) => {
  const itemsQuery = useQuery({
    queryKey: ["items", { page, limit }],
    queryFn: () => {
      return ItemService.getItems({ page, limit });
    },
    retry: false,
  });

  return {
    error: itemsQuery.error,
    refetch: itemsQuery.refetch,
    data: itemsQuery.data,
    loading: itemsQuery.isLoading,
    status: itemsQuery.status,
  };
};
