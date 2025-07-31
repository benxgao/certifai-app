import SystemErrorDemo from '@/src/components/system/SystemErrorDemo';

export default function SystemErrorTestPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
        System Error Notification Test
      </h1>
      <SystemErrorDemo />
    </div>
  );
}
