import React, { useState } from 'react';
import NavigationMenu from '@/components/layout/NavigationMenu';
import AssetRow, { Asset } from '@/components/AssetRow';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Search } from 'lucide-react';

const allAssets: Asset[] = [
  { id: 'btc-usd', name: 'Bitcoin', symbol: 'BTC/USD', price: 62000.50, change24h: 1.75, volume24h: 5.2e9, iconUrl: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=032' },
  { id: 'eth-usd', name: 'Ethereum', symbol: 'ETH/USD', price: 3400.20, change24h: -0.50, volume24h: 3.1e9, iconUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=032' },
  { id: 'sol-usd', name: 'Solana', symbol: 'SOL/USD', price: 150.80, change24h: 3.20, volume24h: 1.5e8, iconUrl: 'https://cryptologos.cc/logos/solana-sol-logo.png?v=032' },
  { id: 'doge-usd', name: 'Dogecoin', symbol: 'DOGE/USD', price: 0.15, change24h: 5.50, volume24h: 8e7, iconUrl: 'https://cryptologos.cc/logos/dogecoin-doge-logo.png?v=032' },
  { id: 'ada-usd', name: 'Cardano', symbol: 'ADA/USD', price: 0.45, change24h: -1.10, volume24h: 6e7, iconUrl: 'https://cryptologos.cc/logos/cardano-ada-logo.png?v=032' },
  { id: 'xrp-usd', name: 'Ripple', symbol: 'XRP/USD', price: 0.52, change24h: 0.80, volume24h: 7e7, iconUrl: 'https://cryptologos.cc/logos/xrp-xrp-logo.png?v=032' },
];

const ITEMS_PER_PAGE = 10;

const MarketsPage = () => {
  console.log('MarketsPage loaded');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("all");

  const handleTradeAsset = (assetId: string) => {
    console.log(`Navigate to trading page for asset: ${assetId}`);
    // navigate(`/trading/${assetId}`);
  };
  
  const filteredAssets = allAssets.filter(asset =>
    (asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     asset.symbol.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (activeTab === "all" || 
     (activeTab === "favorites" && ['btc-usd', 'eth-usd'].includes(asset.id)) || // Dummy favorites
     (activeTab === "defi" && ['sol-usd', 'ada-usd'].includes(asset.id)) ) // Dummy DeFi
  );

  const totalPages = Math.ceil(filteredAssets.length / ITEMS_PER_PAGE);
  const paginatedAssets = filteredAssets.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavigationMenu />
      <main className="flex-1 p-6 container mx-auto space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Markets</h1>
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="search"
              placeholder="Search assets (e.g., Bitcoin, BTC/USD)"
              className="pl-10 w-full"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            />
          </div>
        </header>

        <Tabs value={activeTab} onValueChange={(value) => {setActiveTab(value); setCurrentPage(1);}} className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex">
            <TabsTrigger value="all">All Assets</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="defi">DeFi</TabsTrigger>
            {/* Add more categories as needed */}
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-4">
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Asset</TableHead>
                    <TableHead className="hidden sm:table-cell">Price</TableHead>
                    <TableHead className="text-center">24h Change</TableHead>
                    <TableHead className="text-right hidden md:table-cell">24h Volume</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedAssets.length > 0 ? paginatedAssets.map(asset => (
                     <AssetRow key={asset.id} asset={asset} onTradeClick={handleTradeAsset} />
                  )) : (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center py-10 text-gray-500 dark:text-gray-400">
                            No assets found.
                        </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
        
        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); setCurrentPage(p => Math.max(1, p - 1)); }} disabled={currentPage === 1} />
              </PaginationItem>
              {[...Array(totalPages)].map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink href="#" isActive={currentPage === i + 1} onClick={(e) => { e.preventDefault(); setCurrentPage(i + 1); }}>
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              {/* Add Ellipsis if many pages */}
              <PaginationItem>
                <PaginationNext href="#" onClick={(e) => { e.preventDefault(); setCurrentPage(p => Math.min(totalPages, p + 1)); }} disabled={currentPage === totalPages} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </main>
    </div>
  );
};

export default MarketsPage;