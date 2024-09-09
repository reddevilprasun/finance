import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useCreateAccount } from "@/features/accounts/api/use-create-account";
import { Select } from "@/components/select";

export const useSelectAccount = (): [()=> JSX.Element, ()=> Promise<unknown>] => {
  const accountQuery = useGetAccounts();
  const accountMutation = useCreateAccount();
  const onCreateAccount = (name :string) => {
    accountMutation.mutate({ name });
  }

  const accountOptions = accountQuery.data?.map((account) => ({
    value: account.id,
    label: account.name,
  }));

  const [promise, setPromise] = useState<{resolve: (value: string | undefined) => void} | null>(null);

  const selectValue = useRef<string>();

  const confirm = () => new Promise((resolve, reject) => {
    setPromise({ resolve });
  });

  const handleClose = () => {
    setPromise(null);
  }

  const handleConfirm = () => {
    promise?.resolve(selectValue.current);
    handleClose();
  }

  const handleCancel = () => {
    promise?.resolve(undefined);
    handleClose();
  }

  const ConfirmationDialog = () => (
    <Dialog open={promise !== null}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Account</DialogTitle>
          <DialogDescription>Please select a account to continue</DialogDescription>
        </DialogHeader>
        <Select
          placeholder="Select Account"
          options={accountOptions}
          onCreate={onCreateAccount}
          onChange={(value) => {
            selectValue.current = value;
          }}
          disabled={accountQuery.isLoading || accountMutation.isPending}
        >

        </Select>
        <DialogFooter className="pt-2">
          <Button onClick={handleConfirm}>Confirm</Button>
          <Button variant="outline" onClick={handleCancel}>Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return [ConfirmationDialog, confirm];
}