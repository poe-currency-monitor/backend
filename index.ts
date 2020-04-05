import './config/modules-aliases';

(async (): Promise<void> => {
  const dotenv = await import('dotenv').then((pkg) => pkg.default);

  dotenv.config();

  const app = await import('./config/express').then((pkg) => pkg.default);

  app.init();
})();
