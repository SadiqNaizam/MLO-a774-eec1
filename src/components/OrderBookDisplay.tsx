import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

interface OrderBookEntry {
  price: number;
  size: number;
  total?: number; // Cumulative size
}

interface OrderBookDisplayProps {
  bids: OrderBookEntry[]; // Sorted highest to lowest price
  asks: OrderBookEntry[]; // Sorted lowest to highest price
  assetSymbol?: string;
  maxRows?: number;
}

const OrderBookSide: React.FC<{ title: string; orders: OrderBookEntry[]; colorClass: string; maxRows: number }> = ({ title, orders, colorClass, maxRows }) => (
  <div className="flex-1">
    <h3 className="text-sm font-semibold mb-1 px-2">{title}</h3>
    <div className="grid grid-cols-3 gap-x-2 text-xs text-gray-500 dark:text-gray-400 px-2 mb-1">
      <span>Price (USD)</span>
      <span className="text-right">Size ({/* Asset Symbol */})</span>
      <span className="text-right">Total</span>
    </div>
    <ScrollArea className="h-48 pr-2"> {/* Adjust height as needed */}
      {orders.slice(0, maxRows).map((order, index) => (
        <div key={index} className="grid grid-cols-3 gap-x-2 text-xs py-0.5 px-2 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded relative">
          {/* Background bar for depth visualization */}
          <div
            className={`absolute top-0 bottom-0 right-0 ${colorClass} opacity-10`}
            style={{ width: `${(order.total || 0) / (orders[0]?.total || 1) * 100}%` }} // Simple % width based on total of first row
          />
          <span className={`relative ${title === 'Asks' ? 'text-red-500 dark:text-red-400' : 'text-green-500 dark:text-green-400'}`}>{order.price.toFixed(2)}</span>
          <span className="text-right relative">{order.size.toFixed(4)}</span>
          <span className="text-right relative">{order.total?.toFixed(4) || order.size.toFixed(4)}</span>
        </div>
      ))}
    </ScrollArea>
  </div>
);


const OrderBookDisplay: React.FC<OrderBookDisplayProps> = ({ bids, asks, assetSymbol = "ASSET", maxRows = 15 }) => {
  console.log("Rendering OrderBookDisplay with bids:", bids.length, "asks:", asks.length);

  // Calculate cumulative totals
  const calculateCumulative = (orders: OrderBookEntry[], isBids: boolean): OrderBookEntry[] => {
    let cumulativeSize = 0;
    const sortedOrders = isBids ? [...orders].sort((a, b) => b.price - a.price) : [...orders].sort((a, b) => a.price - b.price);
    return sortedOrders.map(order => {
      cumulativeSize += order.size;
      return { ...order, total: cumulativeSize };
    });
  };
  
  const cumulativeBids = calculateCumulative(bids, true);
  const cumulativeAsks = calculateCumulative(asks, false);


  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-base">Order Book ({assetSymbol})</CardTitle>
      </CardHeader>
      <CardContent className="p-0 sm:p-2">
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <OrderBookSide title="Bids" orders={cumulativeBids} colorClass="bg-green-500" maxRows={maxRows} />
          <Separator orientation="vertical" className="hidden sm:block h-auto" />
          <Separator orientation="horizontal" className="sm:hidden" />
          <OrderBookSide title="Asks" orders={cumulativeAsks} colorClass="bg-red-500" maxRows={maxRows} />
        </div>
         {/* Spread can be calculated and displayed here */}
      </CardContent>
    </Card>
  );
};

export default OrderBookDisplay;