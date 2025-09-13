import UserService from "@/services/user.service";
import { useQuery } from "@tanstack/react-query";

export const useUsers = ({ page, limit }: { page: number; limit: number }) => {
  const userQuery = useQuery({
    queryKey: ["users", { page, limit }],
    queryFn: () => {
      return UserService.getUsers({ page, limit });
    },
    retry: false,
  });

  return {
    error: userQuery.error,
    refetch: userQuery.refetch,
    data: userQuery.data,
    loading: userQuery.isLoading,
    status: userQuery.status,
  };
};
