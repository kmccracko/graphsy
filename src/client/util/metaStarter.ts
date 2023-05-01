export const metaStarter = (): any => {
  return {
    current: ``,
    potential: ``,
    visited: new Set(),
    discovered: new Set(),
    varObj: {},
    logArr: [],
  };
};
