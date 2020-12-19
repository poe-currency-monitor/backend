import './config/modules-aliases';

(async (): Promise<void> => {
  const dotenv = await import('dotenv').then((pkg) => pkg.default);

  dotenv.config();

  const mongo = await import('./config/mongo').then((pkg) => pkg.default);

  await mongo.init();

  const app = await import('./config/express').then((pkg) => pkg.default);

  app.init();
})().catch(() => {});
