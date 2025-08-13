import { Metadata } from 'next';
import { Suspense } from 'react';
import StripeCallbackClient from './client';

export const metadata: Metadata = {
  title: 'Payment Processing | Certifai',
  description: 'Processing your payment and subscription',
};

export default function StripeCallbackPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StripeCallbackClient />
    </Suspense>
  );
}
