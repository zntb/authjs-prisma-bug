'use server';

import { signIn, signOut } from '@/auth';
import { prisma } from '@/lib/prisma';
import { AuthError } from 'next-auth';
import { compare } from 'bcryptjs';
import { revalidatePath } from 'next/cache';

export async function authenticate(prevState: unknown, formData: FormData) {
  try {
    const formdata = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    if (!formdata.email || !formdata.password) {
      return { success: false, message: 'Email and password are required.' };
    }

    const user = await prisma.user.findUnique({
      where: {
        email: formdata.email as string,
      },
    });

    if (!user) {
      return { success: false, message: 'User not found.' };
    }

    const passwordMatch = await compare(
      formdata.password,
      user.password as string,
    );

    if (!passwordMatch) {
      return { success: false, message: 'Invalid credentials' };
    }

    await signIn('credentials', {
      email: formdata.email,
      password: formdata.password,
      redirect: true,
      redirectTo: '/profile',
    });

    revalidatePath('/');

    return { success: true, message: 'Signed in successfully' };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.cause) {
        case 'CredentialsSignin':
          return {
            success: false,
            message: 'Invalid email or password.',
          };
        default:
          return {
            success: false,
            message: 'An error occurred while signing in.',
          };
      }
    }
    throw error;
  }
}

export async function signOutUser() {
  await signOut();
}
