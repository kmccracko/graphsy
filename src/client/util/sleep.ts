export const sleep = (ms: number): Promise<Number> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
