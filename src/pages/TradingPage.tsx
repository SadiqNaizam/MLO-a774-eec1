import React from 'react';
import NavigationMenu from '@/components/layout/NavigationMenu';
import TradingChart from '@/components/TradingChart';
import OrderBookDisplay from '@/components/OrderBookDisplay';
import AdvancedOrderForm from '@/components/AdvancedOrderForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Badge } from '@/components/ui/badge';

// Placeholder data for TradingPage
const samplePriceData = Array.from({ length: 50 }, (_, i) => ({
  timestamp: Math.floor(Date.now() / 1000) - (50 - i) * 60, // Every minute for last 50 mins
  price: 62000 + Math.sin(i / 5) * 100 + Math.random() * 50,
  volume: 10 + Math.random() * 5,
}));

const sampleBids = Array.from({ length: 15 }, (_, i) => ({
  price: 61990 - i * 0.5,
  size: Math.random() * 2,
})).sort((a,b) => b.price - a.price);

const sampleAsks = Array.from({ length: 15 }, (_, i) => ({
  price: 62010 + i * 0.5,
  size: Math.random() * 2,
})).sort((a,b) => a.price - b.price);


const sampleOpenOrders = [
  { id: '1', pair: 'BTC/USD', type: 'Limit', side: 'Buy', price: 61500, amount: 0.1, filled: '0%', total: '6150 USD', status: 'Open' },
  { id: '2', pair: 'ETH/USD', type: 'Limit', side: 'Sell', price: 3500, amount: 2.0, filled: '50%', total: '7000 USD', status: 'Partial Fill' },
];

const sampleTradeHistory = [
  { id: '101', pair: 'BTC/USD', type: 'Market', side: 'Buy', price: 62100, amount: 0.05, total: '3105 USD', date: '2024-07-30 10:00:00' },
  { id: '102', pair: 'SOL/USD', type: 'Limit', side: 'Sell', price: 155, amount: 10, total: '1550 USD', date: '2024-07-30 09:30:00' },
];

const handleSubmitAdvancedOrder = async (data: any) => {
  console.log("Advanced order submitted on TradingPage:", data);
  // Simulate API call
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      console.log("Order processed (mock on TradingPage)");
      // Potentially show a toast notification here
      resolve();
    }, 1000);
  });
};

const TradingPage = () => {
  console.log('TradingPage loaded');
  const currentPair = { baseAsset: "BTC", quoteAsset: "USD", name: "Bitcoin / USD" }; // Example, could come from route params

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-950">
      <NavigationMenu />
      <main className="flex-1 p-4 space-y-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink href="/markets">Markets</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>{currentPair.name}</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main Chart and Order Form Section */}
          <div className="lg:col-span-2 space-y-4">
            <TradingChart data={samplePriceData} assetName={`${currentPair.baseAsset}/${currentPair.quoteAsset} Chart`} height={450} />
          </div>

          {/* Order Book and Order Form Section */}
          <div className="lg:col-span-1 space-y-4">
            <OrderBookDisplay bids={sampleBids} asks={sampleAsks} assetSymbol={currentPair.baseAsset} />
            <AdvancedOrderForm
              baseAsset={currentPair.baseAsset}
              quoteAsset={currentPair.quoteAsset}
              currentPrice={samplePriceData[samplePriceData.length - 1]?.price || 62000}
              balanceBase={0.5} // Example balance
              balanceQuote={10000} // Example balance
              onSubmitOrder={handleSubmitAdvancedOrder}
            />
          </div>
        </div>

        {/* Open Orders and Trade History Section */}
        <Card>
            <CardContent className="p-0">
                <Tabs defaultValue="openOrders" className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 rounded-none border-b">
                    <TabsTrigger value="openOrders">Open Orders ({sampleOpenOrders.length})</TabsTrigger>
                    <TabsTrigger value="tradeHistory">Trade History</TabsTrigger>
                    <TabsTrigger value="positions" className="hidden md:inline-flex">Positions</TabsTrigger>
                    <TabsTrigger value="alerts" className="hidden md:inline-flex">Price Alerts</TabsTrigger>
                </TabsList>
                <TabsContent value="openOrders" className="p-4">
                    <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Pair</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Side</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead>Filled</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sampleOpenOrders.map(order => (
                        <TableRow key={order.id}>
                            <TableCell>{order.pair}</TableCell>
                            <TableCell>{order.type}</TableCell>
                            <TableCell className={order.side === 'Buy' ? 'text-green-500' : 'text-red-500'}>{order.side}</TableCell>
                            <TableCell className="text-right">{order.price}</TableCell>
                            <TableCell className="text-right">{order.amount}</TableCell>
                            <TableCell>{order.filled}</TableCell>
                            <TableCell className="text-right">{order.total}</TableCell>
                            <TableCell><Badge variant={order.status === 'Open' ? 'secondary' : 'default'}>{order.status}</Badge></TableCell>
                            <TableCell className="text-right"><Button variant="ghost" size="sm">Cancel</Button></TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                    {sampleOpenOrders.length === 0 && <p className="text-center text-gray-500 py-4">No open orders.</p>}
                </TabsContent>
                <TabsContent value="tradeHistory" className="p-4">
                    <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Pair</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Side</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sampleTradeHistory.map(trade => (
                        <TableRow key={trade.id}>
                            <TableCell>{trade.date}</TableCell>
                            <TableCell>{trade.pair}</TableCell>
                            <TableCell>{trade.type}</TableCell>
                            <TableCell className={trade.side === 'Buy' ? 'text-green-500' : 'text-red-500'}>{trade.side}</TableCell>
                            <TableCell className="text-right">{trade.price}</TableCell>
                            <TableCell className="text-right">{trade.amount}</TableCell>
                            <TableCell className="text-right">{trade.total}</TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                    {sampleTradeHistory.length === 0 && <p className="text-center text-gray-500 py-4">No trade history.</p>}
                </TabsContent>
                 <TabsContent value="positions" className="p-4">
                    <p className="text-center text-gray-500 py-4">Positions data would be displayed here.</p>
                </TabsContent>
                 <TabsContent value="alerts" className="p-4">
                    <p className="text-center text-gray-500 py-4">Price alerts configuration would be here.</p>
                </TabsContent>
                </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default TradingPage;