import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { borrowApi } from "../../api/borrowApi";
import type { BorrowQuery, BorrowRequest } from "../../types/borrow";

export const useBorrows = (params: BorrowQuery = {}) =>
  useQuery({
    queryKey: ["borrows", params],
    queryFn: () => borrowApi.getAll(params),
    staleTime: 1000 * 60 * 1,
  });

export const useBorrowCard = () =>
  useQuery({
    queryKey: ["borrow-dashboard"],
    queryFn: borrowApi.getCard,
    staleTime: 60 * 1000 * 1,
  });

export const useMyBorrows = (params: BorrowQuery = {}) =>
  useQuery({
    queryKey: ["my-borrows", params],
    queryFn: () => borrowApi.myBorrows(params),
    staleTime: 1000 * 60 * 1,
  });

export const useMyBorrowCard = () =>
  useQuery({
    queryKey: ["my-borrow-dashboard"],
    queryFn: borrowApi.getMyCard,
    staleTime: 60 * 1000 * 1,
  });

export const useCreateBorrow = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: borrowApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["borrows"] });
      queryClient.invalidateQueries({ queryKey: ["my-borrows"] });
      queryClient.invalidateQueries({ queryKey: ["borrow-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["my-borrow-dashboard"] });
    },
  });
};

export const useCreateBorrowForUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: borrowApi.createForUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["borrows"] });
      queryClient.invalidateQueries({ queryKey: ["borrow-dashboard"] });
    },
  });
};

export const useUpdateBorrowForUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: BorrowRequest }) =>
      borrowApi.updateForUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["borrows"] });
      queryClient.invalidateQueries({ queryKey: ["borrow-dashboard"] });
    },
  });
};

export const useApproveBorrow = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: borrowApi.approve,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["borrows"] });
      queryClient.invalidateQueries({ queryKey: ["borrow-dashboard"] });
    },
  });
};

export const useRejectBorrow = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: borrowApi.reject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["borrows"] });
      queryClient.invalidateQueries({ queryKey: ["borrow-dashboard"] });
    },
  });
};

export const useConfirmBorrow = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: borrowApi.confirm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["borrows"] });
      queryClient.invalidateQueries({ queryKey: ["my-borrows"] });
      queryClient.invalidateQueries({ queryKey: ["borrow-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["my-borrow-dashboard"] });
    },
  });
};

export const useReturnBorrow = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: borrowApi.return,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["borrows"] });
      queryClient.invalidateQueries({ queryKey: ["my-borrows"] });
      queryClient.invalidateQueries({ queryKey: ["returns"] });
      queryClient.invalidateQueries({ queryKey: ["my-returns"] });
      queryClient.invalidateQueries({ queryKey: ["borrow-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["my-borrow-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["return-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["my-return-dashboard"] });
    },
  });
};
