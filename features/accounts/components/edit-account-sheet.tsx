import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet'
import { AccountForm } from './account-form';
import { insertAccountSchema } from '@/db/schema';
import { z } from 'zod';
import { useOpenAccount } from '../hooks/use-open-account';
import { useGetAccount } from '../api/use-get-account';
import { Loader2 } from 'lucide-react';
import { useEditAccount } from '../api/use-edit-account';
import { useDeleteAccount } from '../api/use-delete-account';
import { useConfirm } from '@/hooks/use-confirm';

const formSchema = insertAccountSchema.pick({
  name: true,
});

type FormValues = z.infer<typeof formSchema>

export const EditAccountSheet = () => {
  const { isOpen, onClose, id } = useOpenAccount();
  const mutation = useEditAccount(id);
  const deleteMutation = useDeleteAccount(id);
  const accountsQuery = useGetAccount(id);
  const isLoading = accountsQuery.isLoading;


  const onSubmit = (values: FormValues) => {
    mutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  }

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

  const defaultValues = accountsQuery.data ? {
    name: accountsQuery.data.name,
  } : {
    name: '',
  }
  return (
    <>
      <ConfirmationDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className=' space-y-4'>
          <SheetHeader>
            <SheetTitle>Edit Account</SheetTitle>
            <SheetDescription>
              Edit an existing account.
            </SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className=' absolute inset-0 flex items-center justify-center'>
              <Loader2 className="animate-spin size-4 text-muted-foreground" />
            </div>
          ) : (
            <AccountForm
              id={id}
              onSubmit={onSubmit}
              disabled={mutation.isPending || deleteMutation.isPending}
              defaultValues={defaultValues}
              onDelete={onDelete}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}