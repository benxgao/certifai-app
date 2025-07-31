import NotificationBarDemo from '@/src/components/demo/NotificationBarDemo';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NotificationBar Demo - Certifai Design System',
  description: 'Showcase of the enhanced notification bar component with glass-morphism styling',
};

export default function DemoPage() {
  return <NotificationBarDemo />;
}
