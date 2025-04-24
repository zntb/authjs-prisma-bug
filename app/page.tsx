import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-center p-24'>
      <div className='text-center'>
        <h1 className='text-4xl font-bold mb-6'>Welcome to Our App</h1>
        <p className='text-xl mb-8'>Please login to continue</p>
        <Link href='/login'>
          <Button size='lg'>Login</Button>
        </Link>
      </div>
    </main>
  );
}
