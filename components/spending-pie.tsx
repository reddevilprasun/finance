import { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "./ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { FileSearch, Loader2, PieChart, Radar, Target } from "lucide-react";
import { PieVariant } from "./pie-variant";
import { RadarVariant } from "./radar-varient";
import { RadialVariant } from "./radial-variant";
import { Skeleton } from "./ui/skeleton";

type Props = {
  data?: {
    name: string;
    value: number;
  }[];
};

const SpendingPie = ({ data = [] }: Props) => {
  const [chartType, setChartType] = useState("pie");

  const onTypeChange = (type: string) => {
    setChartType(type);
  };

  return (
    <Card className=" border-none drop-shadow-sm">
      <CardHeader className=" flex space-y-2 lg:space-y-0 lg:flex-row lg:items-center justify-between">
        <CardTitle className=" text-xl line-clamp-1">Categories</CardTitle>
        <Select defaultValue={chartType} onValueChange={onTypeChange}>
          <SelectTrigger className="lg:w-auto h-9 rounded-md px-3">
            <SelectValue placeholder="Chart Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pie">
              <div className="flex items-center">
                <PieChart className="mr-2 size-4 shrink-0" />
                <p className=" line-clamp-1">Pie Chart</p>
              </div>
            </SelectItem>
            <SelectItem value="radar">
              <div className="flex items-center">
                <Radar className="mr-2 size-4 shrink-0" />
                <p className=" line-clamp-1">Radar Chart</p>
              </div>
            </SelectItem>
            <SelectItem value="redial">
              <div className="flex items-center">
                <Target className="mr-2 size-4 shrink-0" />
                <p className=" line-clamp-1">Radial Chart</p>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className=" flex flex-col gap-y-4 items-center justify-center h-[350px] w-full">
            <FileSearch className=" text-muted-foreground size-6" />
            <p className=" text-muted-foreground text-sm">
              No data for this period
            </p>
          </div>
        ) : (
          <>
            {(() => {
              switch (chartType) {
                case "pie":
                  return <PieVariant data={data} />;
                case "radar":
                  return <RadarVariant data={data} />;
                case "redial":
                  return <RadialVariant data={data} />;
                default:
                  return null;
              }
            })()}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SpendingPie;

export const SpendingPieLoading = () => {
  return (
    <Card className=" border-none drop-shadow-sm">
      <CardHeader className=" flex space-y-2 lg:space-y-0 lg:flex-row lg:items-center justify-between">
        <Skeleton className=" h-8 w-48" />
        <Skeleton className=" h-8 lg:w-[120px] w-full" />
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full flex items-center justify-center">
          <Loader2 className=" size-6 text-slate-300 animate-spin" />
        </div>
      </CardContent>
    </Card>
  );
};
