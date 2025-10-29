import axios from 'axios';

export const ronin = async (args: string[]): Promise<string> => {
  if (args.length === 0) {
    return 'Usage: ronin [question]';
  }

  const question = args.join(' ');

  try {
    const response = await axios.post('/api/ronin', {
      question,
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    return 'Error: Could not connect to the AI service.';
  }
};
