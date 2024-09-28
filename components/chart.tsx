import { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "./ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { AreaChart, BarChart, FileSearch, LineChart } from "lucide-react";
import AreaVariant from "./areavarient";
import { BarVariant } from "./bar-variant";
import { LineVariant } from "./line-variant";

type Props = {
  data?: {
    date: string;
    income: number;
    expense: number;
  }[];
};

const Chart = ({ data = [] }: Props) => {
  const [chartType, setChartType] = useState("area");

  const onTypeChange = (type: string) => {
    setChartType(type);
  };

  return (
    <Card className=" border-none drop-shadow-sm">
      <CardHeader className=" flex space-y-2 lg:space-y-0 lg:flex-row lg:items-center justify-between">
        <CardTitle className=" text-xl line-clamp-1">Transactions</CardTitle>
        <Select defaultValue={chartType} onValueChange={onTypeChange}>
          <SelectTrigger className="lg:w-auto h-9 rounded-md px-3">
            <SelectValue placeholder="Chart Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="area">
              <div className="flex items-center">
                <AreaChart className="mr-2 size-4 shrink-0" />
                <p className=" line-clamp-1">Area Chart</p>
              </div>
            </SelectItem>
            <SelectItem value="bar">
              <div className="flex items-center">
                <BarChart className="mr-2 size-4 shrink-0" />
                <p className=" line-clamp-1">Bar Chart</p>
              </div>
            </SelectItem>
            <SelectItem value="line">
              <div className="flex items-center">
                <LineChart className="mr-2 size-4 shrink-0" />
                <p className=" line-clamp-1">Line Chart</p>
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
              case "area":
                return <AreaVariant data={data} />;
              case "bar":
                return <BarVariant data={data} />;
              case "line":
                return <LineVariant data={data} />;
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

export default Chart;
