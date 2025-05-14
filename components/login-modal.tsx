'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { LoginForm } from './login-form';

export function LoginModal() {
  const router = useRouter();
  const pathname = usePathname();

  // Don't show modal if already on profile page
  if (pathname === '/profile') return null;

  return (
    <Dialog open onOpenChange={() => router.back()}>
      <DialogContent className='sm:max-w-md'>
        <DialogTitle className='invisible'></DialogTitle>
        <LoginForm />
      </DialogContent>
    </Dialog>
  );
}
