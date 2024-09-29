"use client";
import qs from "query-string";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useGetSummary } from "@/features/summary/api/use-get-summary";
import { useState } from "react";
import { format, subDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { ChevronDown } from "lucide-react";

import { cn, formateDateRange } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "./ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverClose,
} from "./ui/popover";
export const DateFilter = () => {
  const router = useRouter();
  const pathname = usePathname();

  const params = useSearchParams();
  const accountId = params.get("accountId");
  const from = params.get("from") || "";
  const to = params.get("to") || "";

  const defaultTo = new Date();
  const defaultFrom = subDays(defaultTo, 30);

  const paramsState = {
    from: from ? new Date(from) : defaultFrom,
    to: to ? new Date(to) : defaultTo,
  }

  const [date, setDate] = useState<DateRange | undefined>( paramsState);

  const pushToUrl = (date: DateRange | undefined) => {
    const query = {
      accountId,
      from: format(date?.from || defaultFrom, "yyyy-MM-dd"),
      to: format(date?.to || defaultTo, "yyyy-MM-dd"),
    }

    const url = qs.stringifyUrl({
      url: pathname,
      query,
    }, { skipEmptyString: true, skipNull: true });

    router.push(url);
  };

  const onReset = () => {
    setDate(undefined);
    pushToUrl(undefined);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          disabled={false}
          size="sm"
          variant="outline"
          className="lg:w-auto w-full h-9 rounded-md px-3 font-normal bg-white/10 hover:bg-white/20 hover:text-white border-none focus:ring-offset-0 focus:ring-transparent outline-none text-white focus:bg-white/30 transition"
        >
          <span>
            {formateDateRange(paramsState)}
          </span>
          <ChevronDown className="w-5 h-5 ml-2 opacity-50"/>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className=" lg:w-auto w-full p-0">
        <Calendar
          disabled={false}
          initialFocus
          mode="range"
          defaultMonth={date?.from}
          selected={date}
          onSelect={setDate}
          numberOfMonths={2}
        />
        <div className=" p-4 w-full flex items-center gap-x-2">
          <PopoverClose asChild>
            <Button
              disabled={!date?.from || !date?.to}
              variant="outline"
              onClick={onReset}
              className="w-full"
            >
              Reset
            </Button>
          </PopoverClose>
          <PopoverClose asChild>
            <Button
              disabled={!date?.from || !date?.to}
              onClick={() => pushToUrl(date)}
              className="w-full"
            >
              Apply
            </Button>
          </PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  );
};
