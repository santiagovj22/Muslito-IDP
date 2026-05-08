import readline from 'readline';

/**
 * Prompts the user with a yes/no question.
 * Returns true only if the user types "y" or "Y".
 */
export function confirm(question: string): Promise<boolean> {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y');
    });
  });
}
