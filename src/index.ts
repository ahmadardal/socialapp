import banner from "./banner";
import buildApp from "./app";

const port = Number(process.env.PORT) || 3000;
const host = "0.0.0.0";

async function start() {
  const httpServer = await buildApp();

  await httpServer.listen({ port, host });

  banner("TEST-SERVICE", "ENV: DEVELOPMENT", `HOST: ${host}:${port}`);
}

start();
