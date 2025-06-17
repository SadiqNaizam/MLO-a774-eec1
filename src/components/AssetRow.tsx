import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react'; // Icons for price change
import { cn } from '@/lib/utils';

export interface Asset {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number; // Percentage change
  volume24h?: number; // Optional volume
  iconUrl?: string; // Optional icon URL
}

interface AssetRowProps {
  asset: Asset;
  onTradeClick: (assetId: string) => void;
}

const AssetRow: React.FC<AssetRowProps> = ({ asset, onTradeClick }) => {
  console.log("Rendering AssetRow for:", asset.name);

  const PriceChangeIcon = asset.change24h > 0 ? ArrowUpRight : asset.change24h < 0 ? ArrowDownRight : Minus;
  const priceChangeColor = asset.change24h > 0 ? 'text-green-600 dark:text-green-400' : asset.change24h < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400';

  return (
    <div className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-md transition-colors cursor-pointer" onClick={() => onTradeClick(asset.id)}>
      <div className="flex items-center space-x-3">
        {asset.iconUrl ? (
          <img src={asset.iconUrl} alt={asset.name} className="h-8 w-8 rounded-full" onError={(e) => (e.currentTarget.style.display = 'none')} />
        ) : (
          <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm font-medium">
            {asset.symbol.substring(0, 2).toUpperCase()}
          </div>
        )}
        <div>
          <p className="font-semibold text-gray-800 dark:text-gray-100">{asset.name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{asset.symbol.toUpperCase()}</p>
        </div>
      </div>

      <div className="text-right hidden sm:block">
        <p className="font-medium text-gray-800 dark:text-gray-100">${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        {asset.volume24h && <p className="text-xs text-gray-500 dark:text-gray-400">Vol: ${asset.volume24h.toLocaleString()}</p>}
      </div>
      
      <div className={cn("flex items-center space-x-1", priceChangeColor)}>
        <PriceChangeIcon size={16} />
        <span className="text-sm font-medium">{Math.abs(asset.change24h).toFixed(2)}%</span>
      </div>

      <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); onTradeClick(asset.id); }}>
        Trade
      </Button>
    </div>
  );
};

export default AssetRow;