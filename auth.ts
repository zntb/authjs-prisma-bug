import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
  providers: [
    Google,
    CredentialsProvider({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user) return null;

        const isValidPassword = await compare(
          credentials.password.toString(),
          user.password as string,
        );

        if (!isValidPassword) return null;

        return user;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== 'credentials') return true;

      if (!user.id) {
        return false;
      }

      const existingUser = await prisma.user.findUnique({
        where: { id: user.id },
      });

      if (!existingUser) return false;

      // console.log('existingUser from auth.ts signin: ', existingUser);

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }

      // console.log('token from auth.ts jwt: ', token);

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
      }

      // console.log('session from auth.ts session: ', session);

      return session;
    },

    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
});
