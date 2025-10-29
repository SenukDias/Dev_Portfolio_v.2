import { useAuth } from '../authProvider';
import { useShell } from '../shellProvider';

export const ronin = async (args: string[]): Promise<string> => {
  const question = args.join(' ');
  const { setHistory } = useShell.getState();
  const { isAuthenticated } = useAuth.getState();

  if (!isAuthenticated) {
    return 'Error: You must be logged in to use this command.';
  }

  if (args.length === 0) {
    return 'Usage: ronin [question]';
  }

  const response = await fetch('/api/ronin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      question,
    }),
  });

  if (!response.ok) {
    return 'Error: Could not connect to the AI service.';
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let done = false;
  let fullResponse = '';

  const graphic = `
  .------.
  |      |
  |      |
  '------'
  `;

  setHistory(graphic);

  while (!done) {
    const { value, done: readerDone } = await reader.read();
    done = readerDone;
    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split('\\n');

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const json = line.substring(6);
        if (json === '[DONE]') {
          break;
        }

        try {
          const data = JSON.parse(json);
          const content = data.choices[0]?.delta?.content;

          if (content) {
            fullResponse += content;
            setHistory(fullResponse);
          }
        } catch (error) {
          // ignore
        }
      }
    }
  }

  return '';
};
