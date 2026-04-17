import { useMutation, useQuery } from "@tanstack/react-query";
import { categoryApi } from "../../api/categoryApi";
import type { CategoryQuery, CategoryRequest } from "../../types/category";

export const useCategories = (params: CategoryQuery = {}) =>
  useQuery({
    queryKey: ["categories", params],
    queryFn: () => categoryApi.getALl(params),
  });

export const useCreateCategory = () => {
  return useMutation({
    mutationFn: categoryApi.create,
  });
};

export const useUpdateCategory = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CategoryRequest }) =>
      categoryApi.update(id, data),
  });
};

export const useDeleteCategory = () => {
  return useMutation({
    mutationFn: categoryApi.delete,
  });
};
