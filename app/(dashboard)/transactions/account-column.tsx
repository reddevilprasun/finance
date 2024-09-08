import { useOpenAccount } from "@/features/accounts/hooks/use-open-account"

import { cn } from "@/lib/utils"

type Props = {
  account: string;
  accountId: string;
}

export const AccountColumn = ({ account, accountId }: Props) => {
  const { onOpen: onAccountOpen } = useOpenAccount()

  const handleClick = () => {
    onAccountOpen(accountId)
  }

  return (
    <div className=" flex items-center cursor-pointer hover:underline" onClick={handleClick}>
      {account}
    </div>
  ) 
}