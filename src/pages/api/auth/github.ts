import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';

const GITHUB_ID = process.env.GITHUB_ID;
const GITHUB_SECRET = process.env.GITHUB_SECRET;
const GITHUB_SCOPE = 'read:user';
const GITHUB_REDIRECT_URI = `${process.env.NEXT_PUBLIC_URL}/api/auth/github`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { code } = req.query;

  if (!code) {
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_ID}&scope=${GITHUB_SCOPE}&redirect_uri=${GITHUB_REDIRECT_URI}`;
    return res.redirect(authUrl);
  }

  try {
    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: GITHUB_ID,
        client_secret: GITHUB_SECRET,
        code,
      },
      {
        headers: {
          Accept: 'application/json',
        },
      },
    );

    const { access_token } = tokenResponse.data;

    const userResponse = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const { login, name } = userResponse.data;

    res.setHeader(
      'Set-Cookie',
      serialize('access_token', access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
      }),
    );

    res.redirect(`/auth/callback?username=${login}&name=${name}`);
  } catch (error) {
    res.status(500).json({ message: 'Error authenticating with GitHub.' });
  }
}
