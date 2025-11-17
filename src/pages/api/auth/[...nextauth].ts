import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import { Pool } from 'pg';
import PostgresAdapter from '@auth/pg-adapter';
import { comparePassword } from '../../../lib/auth';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default NextAuth({
  adapter: PostgresAdapter(pool),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const client = await pool.connect();
        const user = await client.query('SELECT * FROM users WHERE email = $1', [
          credentials.email,
        ]);
        client.release();

        if (user.rows.length === 0) {
          throw new Error('No user found with the email');
        }

        const isValid = await comparePassword(
          credentials.password,
          user.rows[0].password
        );

        if (!isValid) {
          throw new Error('Could not log you in');
        }

        return {
          id: user.rows[0].id,
          email: user.rows[0].email,
          name: user.rows[0].name,
          image: user.rows[0].image,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
});
