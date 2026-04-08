import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "../../api/dashboardApi";

export const useAdminDashboard = () =>
  useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: dashboardApi.getAdminDashboard,
    staleTime: 20 * 1000 * 1,
  });

export const useOfficerDashboard = () =>
  useQuery({
    queryKey: ["officer-dashboard"],
    queryFn: dashboardApi.getOfficerDashboard,
    staleTime: 20 * 1000 * 1,
  });

export const useBorrowerDashboard = () =>
  useQuery({
    queryKey: ["borrower-dashboard"],
    queryFn: dashboardApi.getBorrowerDashboard,
    staleTime: 20 * 1000 * 1,
  });
