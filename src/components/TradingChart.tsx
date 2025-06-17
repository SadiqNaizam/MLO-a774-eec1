import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// This would typically come from an API or state
interface PriceDataPoint {
  timestamp: number; // Unix timestamp
  price: number;
  volume?: number;
}

interface TradingChartProps {
  data: PriceDataPoint[];
  assetName?: string;
  height?: number;
}

const TradingChart: React.FC<TradingChartProps> = ({ data, assetName = "Asset Price", height = 400 }) => {
  console.log("Rendering TradingChart with data points:", data.length);

  const formattedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      date: new Date(item.timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), // Simple time format
    }));
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{assetName}</CardTitle>
        </CardHeader>
        <CardContent style={{ height: `${height}px` }} className="flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">No chart data available.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{assetName}</CardTitle>
        {/* Add controls for time range, chart type, indicators etc. here */}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart data={formattedData}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis domain={['auto', 'auto']} tick={{ fontSize: 12 }} tickFormatter={(value) => `$${value.toLocaleString()}`} />
            <Tooltip
              formatter={(value: number, name: string) => {
                if (name === 'price') return [`$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, "Price"];
                return [value, name];
              }}
              labelFormatter={(label) => `Time: ${label}`}
              contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '0.5rem', border: '1px solid #ccc' }}
              itemStyle={{ color: '#333' }}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Area type="monotone" dataKey="price" stroke="#8884d8" fillOpacity={1} fill="url(#colorPrice)" name="Price" />
            {/* Optionally add Area for volume if data.volume exists */}
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default TradingChart;