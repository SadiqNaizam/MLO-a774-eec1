import React from 'react';
import NavigationMenu from '@/components/layout/NavigationMenu';
import Sidebar from '@/components/layout/Sidebar';
import AssetRow, { Asset } from '@/components/AssetRow';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from 'recharts';
import { ArrowUpRight, ArrowDownRight, DollarSign, Activity, Settings } from 'lucide-react';

// Placeholder data for dashboard
const portfolioChartData = [
  { date: 'Jan 24', value: 10000 },
  { date: 'Feb 24', value: 10500 },
  { date: 'Mar 24', value: 11200 },
  { date: 'Apr 24', value: 10800 },
  { date: 'May 24', value: 11500 },
  { date: 'Jun 24', value: 12000 },
];

const chartConfig = {
  portfolioValue: {
    label: "Portfolio Value",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const userAssets: Asset[] = [
  { id: 'btc', name: 'Bitcoin', symbol: 'BTC', price: 62000.50, change24h: 1.75, volume24h: 500000000, iconUrl: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=032' },
  { id: 'eth', name: 'Ethereum', symbol: 'ETH', price: 3400.20, change24h: -0.50, volume24h: 300000000, iconUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=032' },
  { id: 'sol', name: 'Solana', symbol: 'SOL', price: 150.80, change24h: 3.20, volume24h: 150000000, iconUrl: 'https://cryptologos.cc/logos/solana-sol-logo.png?v=032' },
];

const DashboardPage = () => {
  console.log('DashboardPage loaded');

  const handleTradeAsset = (assetId: string) => {
    console.log(`Navigate to trade asset: ${assetId}`);
    // In a real app, you'd use navigate hook from react-router-dom
    // navigate(`/trading/${assetId}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavigationMenu />
      <div className="flex flex-1">
        <Sidebar className="hidden md:flex h-auto">
          <nav className="space-y-2 p-4">
            <Button variant="ghost" className="w-full justify-start">
              <DollarSign className="mr-2 h-4 w-4" /> Overview
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Activity className="mr-2 h-4 w-4" /> Activity
            </Button>
             <Button variant="ghost" className="w-full justify-start">
              <Settings className="mr-2 h-4 w-4" /> Settings
            </Button>
          </nav>
        </Sidebar>
        <main className="flex-1 p-6 space-y-6">
          <header>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Dashboard</h1>
          </header>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Portfolio Value</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$12,345.67</div>
                <p className="text-xs text-muted-foreground">+5.2% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">24h P/L</CardTitle>
                <ArrowUpRight className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">+$250.00</div>
                <p className="text-xs text-muted-foreground">+1.8% today</p>
              </CardContent>
            </Card>
             <Card className="lg:col-span-1 flex flex-col justify-center">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="flex gap-2">
                    <Button className="flex-1">Deposit</Button>
                    <Button variant="outline" className="flex-1">Withdraw</Button>
                    <Button variant="secondary" className="flex-1">Trade</Button>
                </CardContent>
            </Card>
          </div>

          <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle>Portfolio Performance</CardTitle>
              <CardDescription>Your portfolio value over the last 6 months.</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <LineChart data={portfolioChartData} margin={{ left: 12, right: 12 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <YAxis
                    tickFormatter={(value) => `$${value / 1000}k`}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="line" />}
                  />
                  <Line
                    dataKey="value"
                    type="monotone"
                    stroke="var(--color-portfolioValue)"
                    strokeWidth={2}
                    dot={true}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>My Assets</CardTitle>
              <CardDescription>Overview of your cryptocurrency holdings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {userAssets.map(asset => (
                <AssetRow key={asset.id} asset={asset} onTradeClick={handleTradeAsset} />
              ))}
            </CardContent>
            <CardFooter>
                <Button variant="outline" className="w-full">View All Assets</Button>
            </CardFooter>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;