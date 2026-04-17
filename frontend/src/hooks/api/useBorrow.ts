import { useMutation, useQuery } from "@tanstack/react-query";
import { borrowApi } from "../../api/borrowApi";
import type {
  BorrowApprovalRequest,
  BorrowQuery,
  BorrowRequest,
} from "../../types/borrow";

export const useBorrows = (params: BorrowQuery = {}) =>
  useQuery({
    queryKey: ["borrows", params],
    queryFn: () => borrowApi.getAll(params),
  });

export const useBorrowCard = () =>
  useQuery({
    queryKey: ["borrow-card"],
    queryFn: borrowApi.getCard,
  });

export const useMyBorrows = (params: BorrowQuery = {}) =>
  useQuery({
    queryKey: ["my-borrows", params],
    queryFn: () => borrowApi.myBorrows(params),
  });

export const useMyBorrowCard = () =>
  useQuery({
    queryKey: ["my-borrow-card"],
    queryFn: borrowApi.getMyCard,
  });

export const useCreateBorrow = () => {
  return useMutation({
    mutationFn: borrowApi.create,
  });
};

export const useCreateBorrowForUser = () => {
  return useMutation({
    mutationFn: borrowApi.createForUser,
  });
};

export const useUpdateBorrowForUser = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: BorrowRequest }) =>
      borrowApi.updateForUser(id, data),
  });
};

export const useApproveBorrow = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: BorrowApprovalRequest }) =>
      borrowApi.approve(id, data),
  });
};

export const useRejectBorrow = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: BorrowApprovalRequest }) =>
      borrowApi.reject(id, data),
  });
};

export const useCancelBorrow = () => {
  return useMutation({
    mutationFn: borrowApi.cancel,
  });
};

export const useConfirmBorrow = () => {
  return useMutation({
    mutationFn: borrowApi.confirm,
  });
};

export const useReturnBorrow = () => {
  return useMutation({
    mutationFn: borrowApi.return,
  });
};

export const useDeleteBorrow = () => {
  return useMutation({
    mutationFn: borrowApi.delete,
  });
};
