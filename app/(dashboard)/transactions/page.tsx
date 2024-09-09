"use client";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton";

import { Loader2, Plus, Upload } from "lucide-react"
import { columns } from "./columns";
import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction";
import { useGetTransactions } from "@/features/transactions/api/use-get-transactions";
import { useBulkDeleteTransactions } from "@/features/transactions/api/use-bulk-delete-transactions";
import { useState } from "react";
import { UploadButton } from "./upload-button";
import { transactions as TransactionSchema } from "@/db/schema";
import { ImportCard } from "./import-card";
import { useSelectAccount } from "@/features/transactions/hooks/use-transation-confirm";
import { toast } from "sonner";
import { useBulkCreateTransactions } from "@/features/transactions/api/use-bulk-create-transactions";

enum VARIANT {
  LIST = "LIST",
  IMPORT = "IMPORT",
}

const INITIAL_IMPORT_RESULT = {
  data: [],
  errors: [],
  meta: {},
}


const TransactionPage = () => {
  const [ AccountDialog , confirm] = useSelectAccount();
  const [variant, setVariant] = useState<VARIANT>(VARIANT.LIST);
  const [importResult, setImportResult] = useState(INITIAL_IMPORT_RESULT);

  const onUpload = (result: typeof INITIAL_IMPORT_RESULT) => {
    setImportResult(result);
    setVariant(VARIANT.IMPORT);
  };

  const onCancelImport = () => { 
    setImportResult(INITIAL_IMPORT_RESULT);
    setVariant(VARIANT.LIST);
  }
  const newTransaction = useNewTransaction();
  const bulkCreateTransaction = useBulkCreateTransactions();
  const transactionsQuery = useGetTransactions();
  const transactions = transactionsQuery.data || [];

  const deleteTransactions = useBulkDeleteTransactions();

  const isDisabled =
    transactionsQuery.isLoading ||
    deleteTransactions.isPending;
  
    const onSubmitImport = async (
      values: typeof TransactionSchema.$inferInsert[],
    ) => {
      const accountId = await confirm();
      if (!accountId) {
        return toast.error("Please select an account to continue");
      };
      const data = values.map((value) => ({
        ...value,
        accountId: accountId as string,
      }));

      bulkCreateTransaction.mutate(data, {
        onSuccess: () => {
          onCancelImport();
        }
      });
    }

  if (transactionsQuery.isLoading) {
    return (
      <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
        <Card className=" border-none drop-shadow-sm">
          <CardHeader>
            <Skeleton
              className="h-8 w-8"
            />
          </CardHeader>
          <CardContent>
            <div className="h-[500px] w-full flex items-center justify-center">
              <Loader2 className=" size-6 text-slate-300 animate-spin" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (variant === VARIANT.IMPORT) {
    return (
      <>
        <AccountDialog />
        <ImportCard
          data={importResult.data}
          onCancel={onCancelImport}
          onSubmit={onSubmitImport}
        />
      </>
    )
  }
  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className=" border-none drop-shadow-sm">
        <CardHeader className=" gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className=" text-xl line-clamp-1">Transactions History</CardTitle>
          <div className=" flex flex-col lg:flex-row gap-y-2 items-center gap-x-2">
            <Button size="sm" onClick={newTransaction.onOpen} className=" w-full lg:w-auto">
              <Plus className=" size-4 mr-2" />
              Add new
            </Button>
            <UploadButton
              onUpload={onUpload}
            />
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            disabled={isDisabled}
            filterKey="payee"
            onDelete={(row) => {
              const ids = row.map((r) => r.original.id);
              deleteTransactions.mutate({ ids });
            }}
            columns={columns}
            data={transactions}
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default TransactionPage