import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import NavigationMenu from '@/components/layout/NavigationMenu';
import AssetRow, { Asset } from '@/components/AssetRow';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { QrCode } from 'lucide-react';

const walletAssets: (Asset & { balance: number; valueUsd: number })[] = [
  { id: 'btc', name: 'Bitcoin', symbol: 'BTC', price: 62000.50, change24h: 1.75, balance: 0.5, valueUsd: 31000.25, iconUrl: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=032' },
  { id: 'eth', name: 'Ethereum', symbol: 'ETH', price: 3400.20, change24h: -0.50, balance: 10, valueUsd: 34002.00, iconUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=032' },
  { id: 'usd', name: 'US Dollar', symbol: 'USD', price: 1.00, change24h: 0, balance: 5000, valueUsd: 5000.00, iconUrl: 'https://via.placeholder.com/40x40?text=USD' },
];

const transactionHistory = [
  { id: 't1', date: '2024-07-29', type: 'Deposit', asset: 'BTC', amount: '0.1 BTC', status: 'Completed' },
  { id: 't2', date: '2024-07-28', type: 'Withdrawal', asset: 'ETH', amount: '1 ETH', status: 'Pending' },
  { id: 't3', date: '2024-07-27', type: 'Trade', asset: 'BTC/USD', amount: 'Sold 0.05 BTC', status: 'Completed' },
];

const depositFormSchema = z.object({
  asset: z.string().min(1, "Please select an asset"),
});
type DepositFormData = z.infer<typeof depositFormSchema>;

const withdrawFormSchema = z.object({
  asset: z.string().min(1, "Please select an asset"),
  address: z.string().min(10, "Please enter a valid address"), // Basic validation
  amount: z.coerce.number().positive("Amount must be positive"),
  memo: z.string().optional(),
});
type WithdrawFormData = z.infer<typeof withdrawFormSchema>;


const WalletPage = () => {
  console.log('WalletPage loaded');
  const [showDepositDialog, setShowDepositDialog] = useState(false);
  const [selectedAssetForDeposit, setSelectedAssetForDeposit] = useState<Asset | null>(null);

  const depositForm = useForm<DepositFormData>({
    resolver: zodResolver(depositFormSchema),
    defaultValues: { asset: "" },
  });

  const withdrawForm = useForm<WithdrawFormData>({
    resolver: zodResolver(withdrawFormSchema),
    defaultValues: { asset: "", address: "", amount: undefined, memo: "" },
  });


  const handleManageAsset = (assetId: string) => {
    console.log(`Manage asset: ${assetId}`);
    const asset = walletAssets.find(a => a.id === assetId);
    if(asset) {
        setSelectedAssetForDeposit(asset);
        depositForm.setValue("asset", asset.symbol); // Pre-fill for dialog
        setShowDepositDialog(true);
    }
  };
  
  const onDepositSubmit = (data: DepositFormData) => {
    console.log("Deposit form submitted:", data);
    const asset = walletAssets.find(a => a.symbol === data.asset);
    if(asset) {
        setSelectedAssetForDeposit(asset);
        setShowDepositDialog(true); // Should already be true if using a dialog trigger
    }
    // In real app: fetch deposit address for data.asset
  };

  const onWithdrawSubmit = (data: WithdrawFormData) => {
    console.log("Withdraw form submitted:", data);
    // In real app: initiate withdrawal
    // Show confirmation dialog
  };

  const totalWalletValue = walletAssets.reduce((sum, asset) => sum + asset.valueUsd, 0);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavigationMenu />
      <main className="flex-1 p-6 container mx-auto space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">My Wallet</h1>
          <Card>
            <CardHeader>
              <CardTitle>Total Wallet Value</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">${totalWalletValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </CardContent>
          </Card>
        </header>

        <Tabs defaultValue="balances" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="balances">Balances</TabsTrigger>
            <TabsTrigger value="deposit">Deposit</TabsTrigger>
            <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="balances" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Asset Balances</CardTitle>
                <CardDescription>Your current holdings for each asset.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {walletAssets.map(asset => (
                    <div key={asset.id} className="border dark:border-gray-700 rounded-lg">
                        <AssetRow asset={asset} onTradeClick={() => handleManageAsset(asset.id)} />
                        <div className="p-3 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-lg">
                            <p className="text-sm">Balance: {asset.balance.toFixed(4)} {asset.symbol.toUpperCase()}</p>
                            <p className="text-sm">Value: ${asset.valueUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                             <div className="mt-2 flex gap-2">
                                <Button size="sm" onClick={() => handleManageAsset(asset.id)}>Deposit</Button>
                                <Button size="sm" variant="outline" onClick={() => console.log(`Withdraw ${asset.symbol}`)}>Withdraw</Button>
                            </div>
                        </div>
                    </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deposit" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Deposit Crypto</CardTitle>
                <CardDescription>Select an asset to get your deposit address.</CardDescription>
              </CardHeader>
              <Form {...depositForm}>
                <form onSubmit={depositForm.handleSubmit(onDepositSubmit)}>
                  <CardContent className="space-y-4">
                    <FormField
                      control={depositForm.control}
                      name="asset"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Select Asset</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger><SelectValue placeholder="Choose an asset" /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {walletAssets.filter(a => a.symbol !== 'USD').map(asset => ( // Exclude USD for crypto deposit
                                <SelectItem key={asset.id} value={asset.symbol}>{asset.name} ({asset.symbol.toUpperCase()})</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {selectedAssetForDeposit && showDepositDialog && (
                        <Dialog open={showDepositDialog} onOpenChange={setShowDepositDialog}>
                             {/* DialogTrigger is implicitly handled by button click */}
                            <DialogContent>
                                <DialogHeader>
                                <DialogTitle>Deposit {selectedAssetForDeposit.name} ({selectedAssetForDeposit.symbol.toUpperCase()})</DialogTitle>
                                <DialogDescription>
                                    Send only {selectedAssetForDeposit.symbol.toUpperCase()} to this address. Sending any other asset may result in permanent loss.
                                </DialogDescription>
                                </DialogHeader>
                                <div className="my-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-md text-center space-y-2">
                                    <p className="font-mono break-all text-sm">bc1qYourBitcoinAddressHere...xyz</p>
                                    <div className="flex justify-center">
                                        <QrCode size={128} />
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Network: {selectedAssetForDeposit.name} Network</p>
                                </div>
                                <DialogFooter>
                                <Button onClick={() => navigator.clipboard.writeText("bc1qYourBitcoinAddressHere...xyz")}>Copy Address</Button>
                                <Button variant="outline" onClick={() => setShowDepositDialog(false)}>Close</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    )}
                  </CardContent>
                  <CardFooter>
                    <DialogTrigger asChild>
                         <Button type="submit" disabled={!depositForm.watch("asset")}>Get Deposit Address</Button>
                    </DialogTrigger>
                  </CardFooter>
                </form>
              </Form>
            </Card>
          </TabsContent>

          <TabsContent value="withdraw" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Withdraw Crypto</CardTitle>
                <CardDescription>Enter address and amount to withdraw.</CardDescription>
              </CardHeader>
              <Form {...withdrawForm}>
                <form onSubmit={withdrawForm.handleSubmit(onWithdrawSubmit)}>
                  <CardContent className="space-y-4">
                    <FormField
                      control={withdrawForm.control}
                      name="asset"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Asset</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select asset" /></SelectTrigger></FormControl>
                            <SelectContent>
                              {walletAssets.map(asset => (
                                <SelectItem key={asset.id} value={asset.symbol}>{asset.name} ({asset.symbol.toUpperCase()}) - Bal: {asset.balance.toFixed(4)}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={withdrawForm.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Withdrawal Address</FormLabel>
                          <FormControl><Input placeholder={`Enter ${withdrawForm.watch("asset") || "asset"} address`} {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={withdrawForm.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount</FormLabel>
                          <FormControl><Input type="number" placeholder="0.00" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={withdrawForm.control}
                      name="memo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Memo / Tag (Optional)</FormLabel>
                          <FormControl><Input placeholder="Enter memo if required" {...field} /></FormControl>
                          <FormDescription>Some assets require a memo for withdrawal.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter>
                    <DialogTrigger asChild>
                      <Button type="submit">Review Withdrawal</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader><DialogTitle>Confirm Withdrawal</DialogTitle></DialogHeader>
                        <DialogDescription>Please review your withdrawal details carefully.</DialogDescription>
                        {/* Display withdrawal details here from formState */}
                        <p>Asset: {withdrawForm.getValues("asset")}</p>
                        <p>Amount: {withdrawForm.getValues("amount")}</p>
                        <p>Address: {withdrawForm.getValues("address")}</p>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => console.log("Close dialog")}>Cancel</Button>
                            <Button onClick={() => console.log("Confirmed withdrawal", withdrawForm.getValues())}>Confirm & Withdraw</Button>
                        </DialogFooter>
                    </DialogContent>
                  </CardFooter>
                </form>
              </Form>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="mt-4">
            <Card>
              <CardHeader><CardTitle>Transaction History</CardTitle></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Asset</TableHead>
                      <TableHead>Amount/Details</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactionHistory.map(tx => (
                      <TableRow key={tx.id}>
                        <TableCell>{tx.date}</TableCell>
                        <TableCell>{tx.type}</TableCell>
                        <TableCell>{tx.asset}</TableCell>
                        <TableCell>{tx.amount}</TableCell>
                        <TableCell className="text-right">{tx.status}</TableCell>
                      </TableRow>
                    ))}
                     {transactionHistory.length === 0 && (
                        <TableRow><TableCell colSpan={5} className="text-center py-4">No transaction history.</TableCell></TableRow>
                     )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default WalletPage;