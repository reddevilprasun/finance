import React from "react";
import { cn, formateCurrency, formatePercentage } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";
import { IconType } from "react-icons/lib";
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardTitle,
} from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import { CountUp } from "./count-up";

const boxVariant = cva("rounded-md p-3 shrink-0", {
  variants: {
    variant: {
      default: "bg-blue-500/20",
      success: "bg-emerald-500/20",
      danger: "bg-rose-500/20",
      warning: "bg-yellow-500/20",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const iconVariant = cva("size-6", {
  variants: {
    variant: {
      default: "fill-blue-500",
      success: "fill-emerald-500",
      danger: "fill-rose-500",
      warning: "fill-yellow-500",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

type BoxVariant = VariantProps<typeof boxVariant>;
type IconVariant = VariantProps<typeof iconVariant>;

interface DataCardProps extends BoxVariant, IconVariant {
  title: string;
  value?: number;
  isLoading: boolean;
  dateRange: string;
  percentageChange?: number;
  icon: IconType;
}

const DataCard = ({
  title,
  value = 0,
  isLoading,
  dateRange,
  percentageChange = 0,
  icon: Icon,
  variant,
}: DataCardProps) => {
  return (
    <Card>
      <CardHeader className=" flex flex-row items-center justify-between gap-x-4">
        <div className=" space-y-2">
          <CardTitle className=" text-2xl line-clamp-1">{title}</CardTitle>
          <CardDescription className=" line-clamp-1">
            {dateRange}
          </CardDescription>
        </div>
        <div className={cn(boxVariant({ variant }))}>
          <Icon className={cn(iconVariant({ variant }))} />
        </div>
      </CardHeader>
      <CardContent>
        <h1 className=" font-bold text-2xl mb-2 line-clamp-1 break-all">
          <CountUp
            preserveValue
            start={0}
            end={value}
            decimals={2}
            decimalPlaces={2}
            formattingFn={formateCurrency}
          />
        </h1>
        <p className={cn(
          "text-sm text-muted-foreground line-clamp-1",
          percentageChange > 0 ? "text-emerald-500" : "text-rose-500"
        )}>
          {formatePercentage(percentageChange, {addPrefix: true})} from last period
        </p>
      </CardContent>
    </Card>
  );
};

export default DataCard;

export const DataCardSkeleton = () => {
  return (
    <Card className=" border-none drop-shadow-sm h-[192px]">
      <CardHeader className=" flex flex-row items-center gap-x-4 justify-between">
        <div className=" space-y-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="rounded-md p-3 shrink-0 w-12 h-12" />
      </CardHeader>
      <CardContent>
          <Skeleton className="w-24 shrink-0 h-10 mb-2" />
          <Skeleton className="w-40 h-4 shrink-0" />
      </CardContent>
    </Card>
  );
}
