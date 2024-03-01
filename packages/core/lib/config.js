const defineConfig = (userConfig) => {
  return Object.assign({}, defaultConfig, userConfig);
};
const defaultConfig = {
  base: "/",
  apiDir: "src/apis"
};
const createServer = () => {
};
export {
  createServer,
  defineConfig
};
