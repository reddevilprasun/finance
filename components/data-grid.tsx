"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import { formateDateRange } from "@/lib/utils";
import { useGetSummary } from "@/features/summary/api/use-get-summary";

import { FaPiggyBank } from "react-icons/fa";
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";
import DataCard, { DataCardSkeleton } from "./data-card";

const DataGrid = () => {
  const { data, isLoading } = useGetSummary();
  const params = useSearchParams();
  const from = params.get("from") || undefined;
  const to = params.get("to") || undefined;

  const dateRangeLabel = formateDateRange({ from, to });
  return (
    <div className=" grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
      {isLoading && (
        <>
          <DataCardSkeleton />
          <DataCardSkeleton />
          <DataCardSkeleton />
        </>
      )}
      {!isLoading && data && (
        <>
          <DataCard
            title="Remaining Balance"
            value={data?.remaining}
            isLoading={isLoading}
            dateRange={dateRangeLabel}
            percentageChange={data?.remainingChange}
            icon={FaPiggyBank}
            variant="default"
          />
          <DataCard
            title="Total Income"
            value={data?.income}
            isLoading={isLoading}
            dateRange={dateRangeLabel}
            percentageChange={data?.incomeChange}
            icon={FaArrowTrendUp}
            variant="success"
          />
          <DataCard
            title="Total Expense"
            value={data?.expense}
            isLoading={isLoading}
            dateRange={dateRangeLabel}
            percentageChange={data?.expenseChange}
            icon={FaArrowTrendDown}
            variant="danger"
          />
        </>
      )}
    </div>
  );
};

export default DataGrid;
