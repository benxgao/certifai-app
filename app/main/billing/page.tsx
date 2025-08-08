import { Metadata } from 'next';
import BillingClient from './client';

export const metadata: Metadata = {
  title: 'Billing & Subscriptions | Certifai',
  description: 'Manage your subscription, billing preferences, and view payment history',
};

export default function BillingPage() {
  return <BillingClient />;
}
