'use client';

import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { LoginForm } from './login-form';

export function LoginModal() {
  const router = useRouter();

  return (
    <Dialog open onOpenChange={() => router.back()}>
      <DialogContent className='sm:max-w-md'>
        <DialogTitle className='invisible'></DialogTitle>
        <LoginForm />
      </DialogContent>
    </Dialog>
  );
}
