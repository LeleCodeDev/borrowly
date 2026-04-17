import { useMutation, useQuery } from "@tanstack/react-query";
import { userApi } from "../../api/userApi";
import type { UserQuery, UserRequest } from "../../types/user";

export const useUsers = (params: UserQuery = {}) =>
  useQuery({
    queryKey: ["users", params],
    queryFn: () => userApi.getAll(params),
  });

export const useUserCard = () =>
  useQuery({
    queryKey: ["user-card"],
    queryFn: userApi.getCard,
  });

export const useCreateUser = () => {
  return useMutation({
    mutationFn: userApi.create,
  });
};

export const useUpdateUser = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UserRequest }) =>
      userApi.update(id, data),
  });
};

export const useDeleteUser = () => {
  return useMutation({
    mutationFn: userApi.delete,
  });
};
