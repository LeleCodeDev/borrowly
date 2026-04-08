import { useQuery } from "@tanstack/react-query";
import { returnApi } from "../../api/returnApi";
import type { ReturnQuery } from "../../types/return";

export const useReturns = (params: ReturnQuery = {}) =>
  useQuery({
    queryKey: ["returns", params],
    queryFn: () => returnApi.getAll(params),
    staleTime: 1000 * 60 * 1,
  });

export const useReturnCard = () =>
  useQuery({
    queryKey: ["return-dashboard"],
    queryFn: () => returnApi.getCard(),
    staleTime: 1000 * 60 * 1,
  });

export const useMyReturnCard = () =>
  useQuery({
    queryKey: ["my-return-dashboard"],
    queryFn: () => returnApi.getMyCard(),
    staleTime: 1000 * 60 * 1,
  });

export const useMyReturns = (params: ReturnQuery = {}) =>
  useQuery({
    queryKey: ["my-returns", params],
    queryFn: () => returnApi.myReturns(params),
    staleTime: 1000 * 60 * 1,
  });
