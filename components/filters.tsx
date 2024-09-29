import { AccountsFilters } from "./accountsFilters";
import { DateFilter } from "./dateFilter";

export const Filters = () => {
  return (
    <div className=" flex flex-col lg:flex-row items-center gap-y-2 lg:gap-y-0 lg:gap-x-2">
      <AccountsFilters/>
      <DateFilter/>
    </div>
  );
}