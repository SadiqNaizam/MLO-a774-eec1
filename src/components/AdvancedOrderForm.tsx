import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast'; // Assuming useToast is set up

const orderFormSchema = z.object({
  orderType: z.enum(['market', 'limit']),
  tradeAction: z.enum(['buy', 'sell']),
  amount: z.coerce.number().positive("Amount must be positive"),
  price: z.coerce.number().optional(), // Required for limit orders
  // Add stopPrice for stop-limit/stop-market if needed
}).refine(data => {
  if (data.orderType === 'limit' && (data.price === undefined || data.price <= 0)) {
    return false;
  }
  return true;
}, {
  message: "Price is required for limit orders and must be positive",
  path: ["price"],
});

type OrderFormData = z.infer<typeof orderFormSchema>;

interface AdvancedOrderFormProps {
  baseAsset: string; // e.g., "BTC"
  quoteAsset: string; // e.g., "USD"
  currentPrice?: number; // For reference
  balanceBase?: number;
  balanceQuote?: number;
  onSubmitOrder: (data: OrderFormData) => Promise<void>;
}

const AdvancedOrderForm: React.FC<AdvancedOrderFormProps> = ({
  baseAsset,
  quoteAsset,
  currentPrice,
  balanceBase = 0,
  balanceQuote = 0,
  onSubmitOrder,
}) => {
  console.log("Rendering AdvancedOrderForm for", `${baseAsset}/${quoteAsset}`);
  
  const [tradeAction, setTradeAction] = useState<'buy' | 'sell'>('buy');

  const { control, handleSubmit, watch, setValue, formState: { errors, isSubmitting }, reset } = useForm<OrderFormData>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      orderType: 'limit',
      tradeAction: 'buy',
      amount: undefined,
      price: currentPrice || undefined,
    },
  });

  const watchedOrderType = watch('orderType');
  const watchedAmount = watch('amount');
  const watchedPrice = watch('price');

  React.useEffect(() => {
    setValue('tradeAction', tradeAction);
  }, [tradeAction, setValue]);

  const handleFormSubmit = async (data: OrderFormData) => {
    console.log("Submitting order:", data);
    try {
      await onSubmitOrder(data);
      toast({ title: "Order Placed", description: `Your ${data.orderType} ${data.tradeAction} order for ${data.amount} ${baseAsset} has been placed.` });
      reset(); // Reset form after successful submission
    } catch (error) {
      console.error("Order submission error:", error);
      toast({ variant: "destructive", title: "Order Failed", description: (error as Error).message || "Could not place order." });
    }
  };
  
  const totalCost = watchedOrderType === 'market' && currentPrice && watchedAmount ? currentPrice * watchedAmount : (watchedPrice && watchedAmount ? watchedPrice * watchedAmount : 0);

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="p-4">
        <Tabs defaultValue="buy" onValueChange={(value) => setTradeAction(value as 'buy' | 'sell')} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="buy" className={cn(tradeAction === 'buy' ? 'data-[state=active]:bg-green-500 data-[state=active]:text-white' : '')}>Buy {baseAsset}</TabsTrigger>
            <TabsTrigger value="sell" className={cn(tradeAction === 'sell' ? 'data-[state=active]:bg-red-500 data-[state=active]:text-white' : '')}>Sell {baseAsset}</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <CardContent className="space-y-4 p-4">
          <div>
            <Label>Order Type</Label>
            <Controller
              name="orderType"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex space-x-4 mt-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="limit" id="limit" />
                    <Label htmlFor="limit">Limit</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="market" id="market" />
                    <Label htmlFor="market">Market</Label>
                  </div>
                </RadioGroup>
              )}
            />
          </div>

          {watchedOrderType === 'limit' && (
            <div>
              <Label htmlFor="price">Price ({quoteAsset})</Label>
              <Controller name="price" control={control} render={({ field }) => <Input id="price" type="number" step="any" placeholder={`Price per ${baseAsset}`} {...field} />} />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
            </div>
          )}

          <div>
            <Label htmlFor="amount">Amount ({baseAsset})</Label>
            <Controller name="amount" control={control} render={({ field }) => <Input id="amount" type="number" step="any" placeholder="Amount to trade" {...field} />} />
            {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>}
            <div className="text-xs text-gray-500 mt-1">
                Available: {tradeAction === 'buy' ? `${balanceQuote.toFixed(2)} ${quoteAsset}` : `${balanceBase.toFixed(4)} ${baseAsset}`}
            </div>
          </div>
          
          {/* Percentage buttons for amount */}
          <div className="flex space-x-2">
            {[25, 50, 75, 100].map(pct => (
              <Button
                key={pct}
                type="button"
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => {
                  const balance = tradeAction === 'buy' ? balanceQuote : balanceBase;
                  let amountToSet = 0;
                  if (tradeAction === 'buy') {
                    const priceForCalc = watchedOrderType === 'limit' ? watchedPrice : currentPrice;
                    if (priceForCalc && priceForCalc > 0) {
                      amountToSet = (balance * (pct / 100)) / priceForCalc;
                    }
                  } else { // selling base asset
                    amountToSet = balance * (pct / 100);
                  }
                  setValue('amount', parseFloat(amountToSet.toFixed(8)), { shouldValidate: true });
                }}
              >
                {pct}%
              </Button>
            ))}
          </div>


          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span>Estimated Total:</span>
              <span>{totalCost > 0 ? `~${totalCost.toFixed(2)} ${quoteAsset}` : `N/A`}</span>
            </div>
            {/* Add fee display if applicable */}
          </div>
        </CardContent>
        <CardFooter className="p-4">
          <Button type="submit" className={cn("w-full", tradeAction === 'buy' ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700")} disabled={isSubmitting}>
            {isSubmitting ? "Placing Order..." : `${tradeAction === 'buy' ? 'Buy' : 'Sell'} ${baseAsset}`}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AdvancedOrderForm;