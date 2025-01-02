'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';

export const description = 'An interactive bar chart';

const chartData = [
  { date: '2024-04-01', pinjaman: 1500000, simpanan: 2200000 },
  { date: '2024-04-02', pinjaman: 1800000, simpanan: 970000 },
  { date: '2024-04-03', pinjaman: 1200000, simpanan: 1670000 },
  { date: '2024-04-04', pinjaman: 2600000, simpanan: 2420000 },
  { date: '2024-04-05', pinjaman: 2900000, simpanan: 3730000 },
  { date: '2024-04-06', pinjaman: 3400000, simpanan: 3010000 },
  { date: '2024-04-07', pinjaman: 1800000, simpanan: 2450000 },
  { date: '2024-04-08', pinjaman: 3200000, simpanan: 4090000 },
  { date: '2024-04-09', pinjaman: 1100000, simpanan: 590000 },
  { date: '2024-04-10', pinjaman: 1900000, simpanan: 2610000 },
  { date: '2024-04-11', pinjaman: 3500000, simpanan: 3270000 },
  { date: '2024-04-12', pinjaman: 2100000, simpanan: 2920000 },
  { date: '2024-04-13', pinjaman: 3800000, simpanan: 3420000 },
  { date: '2024-04-14', pinjaman: 2200000, simpanan: 1370000 },
  { date: '2024-04-15', pinjaman: 1700000, simpanan: 1200000 },
  { date: '2024-04-16', pinjaman: 1900000, simpanan: 1380000 },
  { date: '2024-04-17', pinjaman: 3600000, simpanan: 4460000 },
  { date: '2024-04-18', pinjaman: 4100000, simpanan: 3640000 },
  { date: '2024-04-19', pinjaman: 1800000, simpanan: 2430000 },
  { date: '2024-04-20', pinjaman: 1500000, simpanan: 890000 },
  { date: '2024-04-21', pinjaman: 2000000, simpanan: 1370000 },
  { date: '2024-04-22', pinjaman: 1700000, simpanan: 2240000 },
  { date: '2024-04-23', pinjaman: 2300000, simpanan: 1380000 },
  { date: '2024-04-24', pinjaman: 2900000, simpanan: 3870000 },
  { date: '2024-04-25', pinjaman: 2500000, simpanan: 2150000 },
  { date: '2024-04-26', pinjaman: 1300000, simpanan: 750000 },
  { date: '2024-04-27', pinjaman: 4200000, simpanan: 3830000 },
  { date: '2024-04-28', pinjaman: 1800000, simpanan: 1220000 },
  { date: '2024-04-29', pinjaman: 2400000, simpanan: 3150000 },
  { date: '2024-04-30', pinjaman: 3800000, simpanan: 4540000 },
  { date: '2024-05-01', pinjaman: 2200000, simpanan: 1650000 },
  { date: '2024-05-02', pinjaman: 3100000, simpanan: 2930000 },
  { date: '2024-05-03', pinjaman: 1900000, simpanan: 2470000 },
  { date: '2024-05-04', pinjaman: 4200000, simpanan: 3850000 },
  { date: '2024-05-05', pinjaman: 3900000, simpanan: 4810000 },
  { date: '2024-05-06', pinjaman: 5200000, simpanan: 4980000 },
  { date: '2024-05-07', pinjaman: 3000000, simpanan: 3880000 },
  { date: '2024-05-08', pinjaman: 2100000, simpanan: 1490000 },
  { date: '2024-05-09', pinjaman: 1800000, simpanan: 2270000 },
  { date: '2024-05-10', pinjaman: 3300000, simpanan: 2930000 },
  { date: '2024-05-11', pinjaman: 2700000, simpanan: 3350000 },
  { date: '2024-05-12', pinjaman: 2400000, simpanan: 1970000 },
  { date: '2024-05-13', pinjaman: 1600000, simpanan: 1970000 },
  { date: '2024-05-14', pinjaman: 4900000, simpanan: 4480000 },
  { date: '2024-05-15', pinjaman: 3800000, simpanan: 4730000 },
  { date: '2024-05-16', pinjaman: 4000000, simpanan: 3380000 },
  { date: '2024-05-17', pinjaman: 4200000, simpanan: 4990000 },
  { date: '2024-05-18', pinjaman: 3500000, simpanan: 3150000 },
  { date: '2024-05-19', pinjaman: 1800000, simpanan: 2350000 },
  { date: '2024-05-20', pinjaman: 2300000, simpanan: 1770000 },
  { date: '2024-05-21', pinjaman: 1400000, simpanan: 820000 },
  { date: '2024-05-22', pinjaman: 1200000, simpanan: 810000 },
  { date: '2024-05-23', pinjaman: 2900000, simpanan: 2520000 },
  { date: '2024-05-24', pinjaman: 2200000, simpanan: 2940000 },
  { date: '2024-05-25', pinjaman: 2500000, simpanan: 2010000 },
  { date: '2024-05-26', pinjaman: 1700000, simpanan: 2130000 },
  { date: '2024-05-27', pinjaman: 4600000, simpanan: 4200000 },
  { date: '2024-05-28', pinjaman: 1900000, simpanan: 2330000 },
  { date: '2024-05-29', pinjaman: 1300000, simpanan: 780000 },
  { date: '2024-05-30', pinjaman: 2800000, simpanan: 3400000 },
  { date: '2024-05-31', pinjaman: 2300000, simpanan: 1780000 },
  { date: '2024-06-01', pinjaman: 2000000, simpanan: 1780000 },
  { date: '2024-06-02', pinjaman: 4100000, simpanan: 4700000 },
  { date: '2024-06-03', pinjaman: 1600000, simpanan: 1030000 },
  { date: '2024-06-04', pinjaman: 3800000, simpanan: 4390000 },
  { date: '2024-06-05', pinjaman: 1400000, simpanan: 880000 },
  { date: '2024-06-06', pinjaman: 2500000, simpanan: 2940000 },
  { date: '2024-06-07', pinjaman: 3700000, simpanan: 3230000 },
  { date: '2024-06-08', pinjaman: 3200000, simpanan: 3850000 },
  { date: '2024-06-09', pinjaman: 4800000, simpanan: 4380000 },
  { date: '2024-06-10', pinjaman: 2000000, simpanan: 1550000 },
  { date: '2024-06-11', pinjaman: 1500000, simpanan: 920000 },
  { date: '2024-06-12', pinjaman: 4200000, simpanan: 4920000 },
  { date: '2024-06-13', pinjaman: 1300000, simpanan: 810000 },
  { date: '2024-06-14', pinjaman: 3800000, simpanan: 4260000 },
  { date: '2024-06-15', pinjaman: 3500000, simpanan: 3070000 },
  { date: '2024-06-16', pinjaman: 3100000, simpanan: 3710000 },
  { date: '2024-06-17', pinjaman: 5200000, simpanan: 4750000 },
  { date: '2024-06-18', pinjaman: 1700000, simpanan: 1070000 },
  { date: '2024-06-19', pinjaman: 2900000, simpanan: 3410000 },
  { date: '2024-06-20', pinjaman: 4500000, simpanan: 4080000 },
  { date: '2024-06-21', pinjaman: 2100000, simpanan: 1690000 },
  { date: '2024-06-22', pinjaman: 2700000, simpanan: 3170000 },
  { date: '2024-06-23', pinjaman: 5300000, simpanan: 4800000 },
  { date: '2024-06-24', pinjaman: 1800000, simpanan: 1320000 },
  { date: '2024-06-25', pinjaman: 1900000, simpanan: 1410000 },
  { date: '2024-06-26', pinjaman: 3800000, simpanan: 4340000 },
  { date: '2024-06-27', pinjaman: 4900000, simpanan: 4480000 },
  { date: '2024-06-28', pinjaman: 2000000, simpanan: 1490000 },
  { date: '2024-06-29', pinjaman: 1600000, simpanan: 1030000 },
  { date: '2024-06-30', pinjaman: 4000000, simpanan: 4460000 }
];

const chartConfig = {
  views: {
    label: 'Data'
  },
  simpanan: {
    label: 'Simpanan (4.500 Anggota)',
    color: 'hsl(var(--chart-1))'
  },
  pinjaman: {
    label: 'Pinjaman (1.000 Anggota)',
    color: 'hsl(var(--chart-2))'
  }
} satisfies ChartConfig;

export function BarGraph() {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>('simpanan');

  const total = React.useMemo(
    () => ({
      simpanan: chartData.reduce((acc, curr) => acc + curr.simpanan, 0),
      pinjaman: chartData.reduce((acc, curr) => acc + curr.pinjaman, 0)
    }),
    []
  );

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Simpanan & Pinjaman Anggota</CardTitle>
          <CardDescription>
            Menampilkan data selama 3 bulan terakhir
          </CardDescription>
        </div>
        <div className="flex">
          {['simpanan', 'pinjaman'].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  Rp. {total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[280px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    });
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
