import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

const AZURE_API_KEY = process.env.AZURE_API_KEY;
const AZURE_API_ENDPOINT = process.env.AZURE_API_ENDPOINT;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ message: 'Question is required' });
  }

  try {
    const response = await axios.post(
      `${AZURE_API_ENDPOINT}/openai/deployments/gpt-4o/chat/completions?api-version=2025-01-01-preview`,
      {
        messages: [
          {
            role: 'user',
            content: question,
          },
        ],
        max_tokens: 4096,
        temperature: 1,
        top_p: 1,
        model: 'gpt-4o',
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${AZURE_API_KEY}`,
        },
      },
    );

    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error connecting to the AI service.' });
  }
}
