import { signOutUser } from '@/actions/auth';
import { auth } from '@/auth';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function Page() {
  const session = await auth();

  return (
    <>
      {session ? (
        <div className='flex flex-col gap-4 justify-center items-center'>
          <h1 className='text-2xl font-bold'>Profile</h1>
          <pre>{JSON.stringify(session, null, 2)}</pre>(
          <div>
            <Button onClick={signOutUser}>Sign out</Button>
          </div>
        </div>
      ) : (
        <div className='flex flex-col gap-4 justify-center items-center'>
          <h1 className='text-2xl text-center text-amber-700'>
            You are not signed in
          </h1>
          <Link
            className='px-5 py-2 text-white text-center bg-gray-500 rounded hover:bg-gray-600'
            href='/login'
          >
            Sign in
          </Link>
        </div>
      )}
    </>
  );
}
