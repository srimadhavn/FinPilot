"use client"

import { useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, TooltipProps } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InvestmentOption } from "@/types/investment-plan"

interface AllocationChartProps {
  options: InvestmentOption[];
  totalAmount: number;
}

interface ChartData {
  name: string;
  value: number;
  amount: number;
  color?: string;
}

type CustomLabelProps = {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  index: number;
};

export function AllocationChart({ options, totalAmount }: AllocationChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const data: ChartData[] = options.map((option) => ({
    name: option.type,
    value: option.percentage,
    amount: option.amount,
    color: option.color,
  }));

  const COLORS = [
    "#336699", // Lapis Lazuli - primary investments
    "#86BBD8", // Carolina Blue - secondary investments  
    "#9EE493", // Light Green - growth/success investments
    "#2F4858", // Charcoal - stable/conservative investments
    "#DAF7DC", // Nyanza - safe investments
    "#6B8CAE"  // Mid-tone blue for additional categories
  ];

  const getColor = (index: number) => {
    if (data[index].color) return data[index].color;
    return COLORS[index % COLORS.length];
  };

  const handleMouseEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const handleMouseLeave = () => {
    setActiveIndex(null);
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: CustomLabelProps) => {
    if (percent < 0.05) return null; // Don't show labels for small segments

    const RADIAN = Math.PI / 180;
    const radius = 25 + innerRadius + (outerRadius - innerRadius);
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#888888"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {data[index].name} ({(percent * 100).toFixed(0)}%)
      </text>
    );
  };

  const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as ChartData;
      return (
        <div className="bg-background border rounded-lg shadow-md p-3">
          <p className="font-medium">{data.name}</p>
          <p className="text-muted-foreground">
            ₹{data.amount.toLocaleString()}
          </p>
          <p className="text-muted-foreground">{data.value.toFixed(1)}%</p>
        </div>
      );
    }

    return null;
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="pb-0">
        <CardTitle className="text-xl font-bold">Investment Allocation</CardTitle>
        <CardDescription>
          Total Monthly Investment: ₹{totalAmount.toLocaleString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                animationDuration={800}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getColor(index)}
                    strokeWidth={activeIndex === index ? 2 : 1}
                    stroke={activeIndex === index ? "#fff" : "none"}
                    style={{
                      filter: activeIndex === index ? "drop-shadow(0 0 5px rgba(0,0,0,0.2))" : "none",
                      opacity: activeIndex === null || activeIndex === index ? 1 : 0.7,
                    }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
