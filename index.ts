import './config/modules-aliases';

(async (): Promise<void> => {
  // eslint-disable-next-line no-underscore-dangle
  global.__sentryRootDir = __dirname || process.cwd();

  const dotenv = await import('dotenv').then((pkg) => pkg.default);

  dotenv.config();

  const app = await import('./config/express').then((pkg) => pkg.default);

  app.init();
})();
