import { Button } from '@/src/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import { useEnhancedCheckoutFlow } from '../hooks/useEnhancedCheckoutFlow';

export function SubscriptionManagementCard() {
  const { goToBilling, subscriptionInfo, hasActiveSubscription } = useEnhancedCheckoutFlow();

  if (!hasActiveSubscription) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription Management</CardTitle>
        <CardDescription>
          Manage your billing information, invoices, and subscription plan.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          You are currently subscribed to the{' '}
          <span className="font-semibold text-primary">{subscriptionInfo?.planName}</span> plan.
        </p>
      </CardContent>
      <CardFooter>
        <Button onClick={goToBilling}>Go to Billing Portal</Button>
      </CardFooter>
    </Card>
  );
}
