import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet'
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { useConfirm } from '@/hooks/use-confirm';
import { useOpenTransaction } from '../hooks/use-open-transaction';
import { useEditTransaction } from '../api/use-edit-transaction';
import { useDeleteTransaction } from '../api/use-delete-transaction';
import { useGetTransaction } from '../api/use-get-transaction';
import { insertTransactionsSchema } from '@/db/schema';
import { TransactionForm } from './transaction-form';
import { useGetCategories } from '@/features/categories/api/use-get-categories';
import { useCreateCategory } from '@/features/categories/api/use-create-category';
import { useCreateAccount } from '@/features/accounts/api/use-create-account';
import { useGetAccounts } from '@/features/accounts/api/use-get-accounts';

const formSchema = insertTransactionsSchema.omit({
  id: true,
});

type FormValues = z.infer<typeof formSchema>

export const EditTransactionSheet = () => {
  const { isOpen, onClose, id } = useOpenTransaction();
  const mutation = useEditTransaction(id);
  const deleteMutation = useDeleteTransaction(id);
  const transactionsQuery = useGetTransaction(id);


  const categoryQuery = useGetCategories();
  const categoryMutation = useCreateCategory();
  const onCreateCategory = (name: string) => {
    categoryMutation.mutate({
      name,
    })
  }
  const categoryOptions = (categoryQuery.data || []).map((category) => ({
    label: category.name,
    value: category.id,
  }))

  const accountQuery = useGetAccounts();
  const accountMutation = useCreateAccount();
  const onCreateAccount = (name: string) => {
    accountMutation.mutate({
      name,
    })
  }
  const accountOptions = (accountQuery.data || []).map((account) => ({
    label: account.name,
    value: account.id,
  }))


  const onSubmit = (values: FormValues) => {
    mutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  }

  const isLoading = transactionsQuery.isLoading || categoryQuery.isLoading || accountQuery.isLoading;


  const isPending =
    mutation.isPending || deleteMutation.isPending || categoryMutation.isPending || accountMutation.isPending;


  const [ConfirmationDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this transaction"
  )

  const onDelete = async () => {
    const ok = await confirm();

    if (ok) {
      deleteMutation.mutate(undefined, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  }

  const defaultValues = transactionsQuery.data ? {
    accountId: transactionsQuery.data.accountId,
    amount: transactionsQuery.data.amount.toString(),
    categoryId: transactionsQuery.data.categoryId,
    date: transactionsQuery.data.date ? new Date(transactionsQuery.data.date) : new Date(),
    payee: transactionsQuery.data.payee,
    notes: transactionsQuery.data.notes,
  } : {
    accountId: '',
    amount: '',
    categoryId: '',
    date: new Date(),
    payee: '',
    notes: '',
  }
  return (
    <>
      <ConfirmationDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className=' space-y-4'>
          <SheetHeader>
            <SheetTitle>Edit Transaction</SheetTitle>
            <SheetDescription>
              Edit an existing Transaction.
            </SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className=' absolute inset-0 flex items-center justify-center'>
              <Loader2 className="animate-spin size-4 text-muted-foreground" />
            </div>
          ) : (
            <TransactionForm
              id={id}
              onSubmit={onSubmit}
              disabled={isPending}
              categoryOptions={categoryOptions}
              accountOptions={accountOptions}
              onCreateCategory={onCreateCategory}
              onCreateAccount={onCreateAccount}
              defaultValues={defaultValues}
              onDelete={onDelete}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}