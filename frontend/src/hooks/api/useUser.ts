import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userApi } from "../../api/userApi";
import type { UserQuery, UserRequest } from "../../types/user";

export const useUsers = (params: UserQuery = {}) =>
  useQuery({
    queryKey: ["users", params],
    queryFn: () => userApi.getAll(params),
    staleTime: 60 * 1000 * 1,
  });

export const useUserCard = () =>
  useQuery({
    queryKey: ["user-dashboard"],
    queryFn: userApi.getCard,
    staleTime: 60 * 1000 * 1,
  });

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user-dashboard"] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UserRequest }) =>
      userApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user-dashboard"] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user-dashboard"] });
    },
  });
};
