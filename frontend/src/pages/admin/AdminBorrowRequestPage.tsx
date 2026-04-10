import type { AxiosError } from "axios";
import {
  CheckCircle,
  ClipboardList,
  Eye,
  Filter,
  Package,
  Pencil,
  Plus,
  Trash2,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import AdminCreateBorrowModal from "../../components/borrow/AdminCreateBorrowModal";
import BorrowStatusBadge from "../../components/ui/BorrowStatusBadge";
import { Button } from "../../components/ui/button";
import ButtonThemeSwitcher from "../../components/ui/ButtonThemeSwitcher";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Dialog, DialogContent } from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../components/ui/pagination";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Separator } from "../../components/ui/separator";
import { SidebarTrigger } from "../../components/ui/sidebar";
import { Spinner } from "../../components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  useBorrowCard,
  useBorrows,
  useCreateBorrowForUser,
  useDeleteBorrow,
  useUpdateBorrowForUser,
} from "../../hooks/api/useBorrow";
import { useItems } from "../../hooks/api/useItem";
import { useUsers } from "../../hooks/api/useUser";
import { formatDate } from "../../lib/formatDate";
import type { ApiError } from "../../types/apiResponse";
import type {
  Borrow,
  BorrowError,
  BorrowForUserRequest,
  BorrowStatus,
} from "../../types/borrow";
import { formatDateValue } from "../../lib/formatDateValue";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";

const BaseURL = import.meta.env.VITE_APP_BASE_URL;

const OfficerBorrowRequestPage = () => {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedBorrow, setSelectedBorrow] = useState<Borrow | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<BorrowError | null>(null);
  const [editingBorrow, setEditingBorrow] = useState<Borrow | null>(null);
  const [deletingBorrowId, setDeletingBorrowId] = useState<number | null>(null);
  const [borrowForm, setBorrowForm] = useState<BorrowForUserRequest>({
    userId: 0,
    itemId: 0,
    borrowDate: null,
    returnDate: null,
    quantity: 0,
    purpose: "",
  });

  const hasActiveFilters = !!statusFilter || !!startDate || !!endDate;

  const { data, isPending } = useBorrows({
    page,
    size,
    status: statusFilter as BorrowStatus,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });

  const { data: usersData, isPending: userIsPending } = useUsers({
    unpage: true,
  });

  const { data: itemData, isPending: itemIsPending } = useItems({
    unpage: true,
  });

  const { data: dashboardData, isPending: dashboardDataIsPending } =
    useBorrowCard();

  const createBorrowForUser = useCreateBorrowForUser();
  const updateBorrowForUser = useUpdateBorrowForUser();
  const deleteBorrow = useDeleteBorrow();

  const borrows = data?.data;
  const totalPages = data?.pagination?.totalPages ?? 1;

  const handleReset = () => {
    setStatusFilter("");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  const handleOpenDialog = (borrow?: Borrow) => {
    setFieldErrors(null);
    if (borrow) {
      setEditingBorrow(borrow);
      setBorrowForm({
        userId: borrow.user?.id ?? 0,
        itemId: borrow.item?.id ?? 0,
        purpose: borrow.purpose,
        quantity: borrow.quantity,
        borrowDate: formatDateValue(borrow.borrowDate),
        returnDate: formatDateValue(borrow.returnDate),
      });
    } else {
      setEditingBorrow(null);
      setBorrowForm({
        userId: 0,
        itemId: 0,
        borrowDate: null,
        returnDate: null,
        quantity: 0,
        purpose: "",
      });
    }
    setIsBorrowModalOpen(true);
  };

  const handleSubmitBorrow = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (editingBorrow) {
      updateBorrowForUser.mutate(
        { id: editingBorrow.id, data: borrowForm },
        {
          onSuccess: (data) => {
            toast.success(data.message);
            setIsBorrowModalOpen(false);
          },
          onError: (err) => {
            const error = err as AxiosError<ApiError<BorrowError>>;
            toast.error(
              error.response?.data.message || "Update borrow request failed",
            );
            if (error.response?.data.errors) {
              setFieldErrors(error.response.data.errors);
            }
          },
        },
      );
    } else {
      createBorrowForUser.mutate(borrowForm, {
        onSuccess: (data) => {
          toast.success(data.message);
          setIsBorrowModalOpen(false);
        },
        onError: (err) => {
          const error = err as AxiosError<ApiError<BorrowError>>;
          toast.error(
            error.response?.data.message || "Create borrow request failed",
          );
          if (error.response?.data.errors) {
            setFieldErrors(error.response.data.errors);
          }
        },
      });
    }
  };

  const handleChange = (
    field: keyof BorrowForUserRequest,

    value: BorrowForUserRequest[keyof BorrowForUserRequest],
  ) => {
    setBorrowForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleDelete = () => {
    if (deletingBorrowId) {
      deleteBorrow.mutate(deletingBorrowId, {
        onSuccess: (data) => {
          toast.success(data.message);
          setIsDeleteDialogOpen(false);
          setDeletingBorrowId(null);
        },
        onError: (err) => {
          const error = err as AxiosError<ApiError<null>>;
          toast.error(error.response?.data.message || "Delete borrow failed");
        },
      });
    }
  };

  return (
    <div className="min-h-screen ">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-10">
        <div className="flex w-full items-center justify-between h-15 px-2">
          <div className="flex items-center gap-3">
            <SidebarTrigger size="icon-lg" className="hover:cursor-pointer" />
            <Separator
              orientation="vertical"
              className="data-[orientation=vertical]:h-5"
            />
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">Borrow Requests</h1>
            </div>
          </div>
          <ButtonThemeSwitcher />
        </div>
      </header>

      <main className="p-6 space-y-6">
        {/* Stats — primary accent on pending */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="border-yellow-100 dark:border-yellow-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium text-muted-foreground">
                Pending
              </p>
              <div className="h-9 w-9 rounded-lg bg-yellow-50 dark:bg-yellow-950 flex items-center justify-center">
                <ClipboardList className="h-4 w-4 text-yellow-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight">
                {dashboardDataIsPending ? (
                  <Spinner />
                ) : (
                  dashboardData?.totalPending
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Awaiting your action
              </p>
            </CardContent>
          </Card>

          <Card className="border-green-100 dark:border-green-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium text-muted-foreground">
                Approved
              </p>
              <div className="h-9 w-9 rounded-lg bg-green-50 dark:bg-green-950 flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight">
                {dashboardDataIsPending ? (
                  <Spinner />
                ) : (
                  dashboardData?.totalApproved
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Ready to pick up
              </p>
            </CardContent>
          </Card>

          <Card className="border-red-100 dark:border-red-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium text-muted-foreground">
                Rejected
              </p>
              <div className="h-9 w-9 rounded-lg bg-red-50 dark:bg-red-950 flex items-center justify-center">
                <XCircle className="h-4 w-4 text-red-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight">
                {dashboardDataIsPending ? (
                  <Spinner />
                ) : (
                  dashboardData?.totalRejected
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Declined requests
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Table Card */}
        <Card>
          <CardHeader className="">
            <div className="flex items-center justify-between w-full gap-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="shrink-0 hover:cursor-pointer gap-2"
                  >
                    <Filter className="h-4 w-4" />
                    Filter
                    {hasActiveFilters && (
                      <span className="h-2 w-2 rounded-full bg-primary" />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="end">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-sm">Filters</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground hover:cursor-pointer"
                        onClick={handleReset}
                      >
                        Reset
                      </Button>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <Label className="text-xs text-muted-foreground">
                        Status
                      </Label>
                      <Select
                        value={statusFilter || "all"}
                        onValueChange={(v) => {
                          setStatusFilter(v === "all" ? "" : v);
                          setPage(1);
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                          <SelectItem value="borrowed">Borrowed</SelectItem>
                          <SelectItem value="returned">Returned</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <Label className="text-xs text-muted-foreground">
                        Borrow Date Range
                      </Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs text-muted-foreground">
                            From
                          </span>
                          <Input
                            type="date"
                            value={startDate}
                            onChange={(e) => {
                              setStartDate(e.target.value);
                              setPage(1);
                            }}
                            className="h-9 text-sm"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-xs text-muted-foreground">
                            To
                          </span>
                          <Input
                            type="date"
                            value={endDate}
                            min={startDate}
                            onChange={(e) => {
                              setEndDate(e.target.value);
                              setPage(1);
                            }}
                            className="h-9 text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    {hasActiveFilters && (
                      <div className="flex flex-wrap gap-1.5 pt-1 border-t">
                        {statusFilter && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs">
                            Status:{" "}
                            <span className="font-medium capitalize">
                              {statusFilter}
                            </span>
                          </span>
                        )}
                        {startDate && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs">
                            From:{" "}
                            <span className="font-medium">
                              {formatDate(startDate)}
                            </span>
                          </span>
                        )}
                        {endDate && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs">
                            To:{" "}
                            <span className="font-medium">
                              {formatDate(endDate)}
                            </span>
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>

              <Button
                className="hover:cursor-pointer shrink-0 gap-2"
                onClick={() => handleOpenDialog()}
              >
                <Plus className="h-4 w-4" />
                Add borrow request
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto w-full">
              <Table className="table-fixed w-full min-w-175">
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="w-14 pl-6 font-semibold text-foreground">
                      No
                    </TableHead>
                    <TableHead className="font-semibold text-foreground">
                      Item
                    </TableHead>
                    <TableHead className="w-28 font-semibold text-foreground">
                      Borrower
                    </TableHead>
                    <TableHead className="w-28 font-semibold text-foreground">
                      Reviewed By
                    </TableHead>
                    <TableHead className="w-28 font-semibold text-foreground">
                      Borrow Date
                    </TableHead>
                    <TableHead className="w-28 font-semibold text-foreground">
                      Return Date
                    </TableHead>
                    <TableHead className="w-24 font-semibold text-foreground">
                      Status
                    </TableHead>
                    <TableHead className="w-28 pr-6 text-center font-semibold text-foreground" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isPending ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-16">
                        <div className="flex flex-col items-center gap-3">
                          <Spinner className="w-8 h-8" />
                          <p className="text-sm text-muted-foreground">
                            Loading requests...
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : borrows?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-16">
                        <div className="flex flex-col items-center gap-3">
                          <ClipboardList className="h-8 w-8 text-muted-foreground/30" />
                          <p className="text-sm text-muted-foreground">
                            No requests found
                          </p>
                          {hasActiveFilters && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="hover:cursor-pointer"
                              onClick={handleReset}
                            >
                              Clear filters
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    borrows?.map((borrow, index) => (
                      <TableRow
                        key={borrow.id}
                        className="hover:bg-muted/30 transition-colors group"
                      >
                        <TableCell className="pl-6 text-muted-foreground text-sm">
                          {(page - 1) * size + index + 1}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-lg overflow-hidden bg-muted shrink-0">
                              {borrow.item?.image ? (
                                <img
                                  src={BaseURL + "/" + borrow.item.image}
                                  alt={borrow.item.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center">
                                  <Package className="h-4 w-4 text-muted-foreground/40" />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-sm leading-tight">
                                {borrow.item?.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {borrow.item?.category?.name}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm font-medium leading-tight">
                            {borrow.user?.username}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {borrow.user?.email}
                          </p>
                        </TableCell>

                        <TableCell>
                          <p className="text-sm font-medium leading-tight">
                            {borrow.reviewedUser?.username}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {borrow.reviewedUser?.email}
                          </p>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(borrow.borrowDate)}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(borrow.returnDate)}
                        </TableCell>
                        <TableCell>
                          <BorrowStatusBadge status={borrow.status} />
                        </TableCell>
                        <TableCell className="text-center pr-4">
                          <div className="flex justify-center items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:cursor-pointer "
                              onClick={() => {
                                setSelectedBorrow(borrow);
                                setIsDetailOpen(true);
                              }}
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                            {(borrow.status == "pending" ||
                              borrow.status == "rejected") && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:cursor-pointer"
                                onClick={() => handleOpenDialog(borrow)}
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                            )}
                            {(borrow.status == "pending" ||
                              borrow.status == "rejected") && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:cursor-pointer hover:bg-red-50 dark:hover:bg-red-950"
                                onClick={() => {
                                  setDeletingBorrowId(borrow.id);
                                  setIsDeleteDialogOpen(true);
                                }}
                              >
                                <Trash2 className="h-3.5 w-3.5 text-destructive" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <div className="flex items-center gap-2">
              <Label
                htmlFor="rows-per-page"
                className="text-sm text-muted-foreground whitespace-nowrap"
              >
                Rows per page
              </Label>
              <Select
                defaultValue="10"
                onValueChange={(v) => setSize(Number(v))}
              >
                <SelectTrigger className=" h-8" id="rows-per-page">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align="start">
                  <SelectGroup>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {data?.pagination && (
                <span className="text-xs text-muted-foreground">
                  {(page - 1) * size + 1}–
                  {Math.min(page * size, data.pagination.totalPages)} of{" "}
                  {data.pagination.totalPages}
                </span>
              )}
            </div>

            {totalPages > 1 && (
              <Pagination className="mx-0 w-auto">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setPage((p) => Math.max(p - 1, 1))}
                      className={
                        page === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) => (
                      <PaginationItem key={p}>
                        <PaginationLink
                          isActive={page === p}
                          onClick={() => setPage(p)}
                          className="cursor-pointer"
                        >
                          {p}
                        </PaginationLink>
                      </PaginationItem>
                    ),
                  )}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setPage((p) => Math.min(p + 1, totalPages))
                      }
                      className={
                        page === totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </Card>
      </main>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-4xl p-0 overflow-hidden gap-0">
          {selectedBorrow && (
            <>
              {/* Hero */}
              <div className="relative h-64 w-full overflow-hidden bg-muted shrink-0">
                {selectedBorrow.item?.image ? (
                  <img
                    src={BaseURL + "/" + selectedBorrow.item.image}
                    alt={selectedBorrow.item.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Package className="h-10 w-10 text-muted-foreground/20" />
                  </div>
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-lg font-bold text-white mt-1.5 leading-tight">
                    {selectedBorrow.item?.name}
                  </h3>
                  <p className="text-xs text-white/60 mt-0.5">
                    {selectedBorrow.item?.category?.name}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 divide-x divide-border">
                <div className="p-5 space-y-4">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                    Item Details
                  </p>
                  <div className="space-y-3">
                    <div className="space-y-0.5">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                        Name
                      </p>
                      <p className="text-sm font-semibold">
                        {selectedBorrow.item?.name}
                      </p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                        Category
                      </p>
                      <p className="text-sm font-semibold">
                        {selectedBorrow.item?.category?.name}
                      </p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                        Qty Borrowed
                      </p>
                      <p className="text-sm font-semibold">
                        {selectedBorrow.quantity}
                      </p>
                    </div>
                    {selectedBorrow.item?.description && (
                      <div className="space-y-0.5">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                          Description
                        </p>
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
                          {selectedBorrow.item.description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                    Borrow Details
                  </p>

                  <div className="grid grid-cols-3 divide-x divide-border border-2 border-border rounded-lg overflow-hidden">
                    <div className="flex flex-col gap-0.5 px-2.5 py-2.5 bg-muted/30">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                        Borrow
                      </p>
                      <p className="text-xs font-semibold leading-tight">
                        {formatDate(selectedBorrow.borrowDate, true)}
                      </p>
                    </div>
                    <div className="flex flex-col gap-0.5 px-2.5 py-2.5 bg-muted/30">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                        Return
                      </p>
                      <p className="text-xs font-semibold leading-tight">
                        {formatDate(selectedBorrow.returnDate, true)}
                      </p>
                    </div>
                    <div className="flex flex-col gap-0.5 px-2.5 py-2.5 bg-muted/30">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                        Days
                      </p>
                      <p className="text-xs font-bold leading-tight">
                        {Math.ceil(
                          (new Date(selectedBorrow.returnDate).getTime() -
                            new Date(selectedBorrow.borrowDate).getTime()) /
                            (1000 * 60 * 60 * 24),
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">
                      Borrower
                    </p>
                    <div className="p-2.5 rounded-lg border bg-muted/20 space-y-0.5">
                      <p className="text-sm font-semibold leading-tight">
                        {selectedBorrow.user?.username}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {selectedBorrow.user?.email}
                      </p>
                      {selectedBorrow.user?.phone && (
                        <p className="text-xs text-muted-foreground">
                          {selectedBorrow.user.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  {selectedBorrow.purpose && (
                    <div className="space-y-1.5">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">
                        Purpose
                      </p>
                      <p className="text-sm bg-muted/50 rounded-lg px-3 py-2.5 leading-relaxed text-foreground">
                        {selectedBorrow.purpose}
                      </p>
                    </div>
                  )}
                </div>

                <div className="p-5 space-y-4">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                    Review Details
                  </p>

                  {selectedBorrow.officerNote && (
                    <div className="space-y-1.5">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">
                        Officer Note
                      </p>
                      <p className="text-sm bg-muted/50 rounded-lg px-3 py-2.5 leading-relaxed text-foreground">
                        {selectedBorrow.officerNote}
                      </p>
                    </div>
                  )}

                  {selectedBorrow.reviewedUser ? (
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">
                          {selectedBorrow.status === "rejected"
                            ? "Rejected by"
                            : "Reviewed by"}
                        </p>
                        <div className="p-2.5 rounded-lg border bg-muted/20 space-y-0.5">
                          <p className="text-sm font-semibold leading-tight">
                            {selectedBorrow.reviewedUser.username}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {selectedBorrow.reviewedUser.email}
                          </p>
                        </div>
                      </div>

                      {selectedBorrow.reviewAt && (
                        <div className="space-y-0.5">
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                            Reviewed At
                          </p>
                          <p className="text-sm font-semibold leading-tight">
                            {formatDate(selectedBorrow.reviewAt, true)}
                          </p>
                        </div>
                      )}

                      <div className="space-y-0.5">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                          Status
                        </p>
                        <BorrowStatusBadge status={selectedBorrow.status} />
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-65 gap-2 rounded-lg border border-dashed border-border">
                      <ClipboardList className="h-5 w-5 text-muted-foreground/30" />
                      <p className="text-xs text-muted-foreground text-center">
                        Not yet reviewed
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="px-5 pb-5 pt-4 border-t">
                <Button
                  variant="outline"
                  className="w-full hover:cursor-pointer"
                  onClick={() => setIsDetailOpen(false)}
                >
                  Close
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <AdminCreateBorrowModal
        isEdit={editingBorrow != null}
        isOpen={isBorrowModalOpen}
        items={itemData?.data || []}
        itemIsPending={itemIsPending}
        formData={borrowForm}
        fieldErrors={fieldErrors}
        isPending={
          editingBorrow
            ? updateBorrowForUser.isPending
            : createBorrowForUser.isPending
        }
        users={usersData?.data || []}
        userIsPending={userIsPending}
        onChange={handleChange}
        onSubmit={handleSubmitBorrow}
        onOpenChange={setIsBorrowModalOpen}
        onClose={() => setIsBorrowModalOpen(false)}
      />

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Borrow</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              borrow history from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="hover:cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <Button
              className="bg-red-600 hover:bg-red-700 hover:cursor-pointer transition-colors"
              onClick={handleDelete}
              disabled={deleteBorrow.isPending}
            >
              {deleteBorrow.isPending ? (
                <span className="flex items-center gap-2">
                  <Spinner data-icon="inline-start" />
                  Deleting...
                </span>
              ) : (
                "Delete"
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default OfficerBorrowRequestPage;
