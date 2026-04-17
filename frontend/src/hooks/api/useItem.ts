import { useMutation, useQuery } from "@tanstack/react-query";
import { itemApi } from "../../api/itemApi";
import type { ItemQuery, ItemRequest } from "../../types/item";

export const useItems = (params: ItemQuery = {}) =>
  useQuery({
    queryKey: ["items", params],
    queryFn: () => itemApi.getAll(params),
  });

export const useItemCard = () =>
  useQuery({
    queryKey: ["item-card"],
    queryFn: itemApi.getCard,
  });

export const useCreateItem = () => {
  return useMutation({
    mutationFn: itemApi.create,
  });
};

export const useUpdateItem = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ItemRequest }) =>
      itemApi.update(id, data),
  });
};

export const useDeleteItem = () => {
  return useMutation({
    mutationFn: itemApi.delete,
  });
};
