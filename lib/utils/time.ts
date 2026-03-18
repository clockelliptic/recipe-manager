/**
 * Delays execution for a specified number of milliseconds.
 * @param ms The number of milliseconds to wait.
 */
export const delay = (ms: number): Promise<void> => 
  new Promise((resolve) => setTimeout(resolve, ms));
