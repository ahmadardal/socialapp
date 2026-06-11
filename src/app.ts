import fastifyCors from "@fastify/cors";
import fastify from "fastify";
import auth from "./auth";
import fastifyMultipart from "@fastify/multipart";
import userRoutes from "./routes/userRoutes";
import postRoutes from "./routes/postRoutes";

async function buildApp() {
  const httpServer = fastify({ logger: true });

  httpServer.setErrorHandler((err: any, req, rep) => {
    if (err?.statusCode === 400) {
      return rep.status(400).send({ message: err.message });
    }

    console.log(err);

    return rep.status(500).send({
      message: "Unknown error occurred",
    });
  });

  await httpServer.register(fastifyCors, { origin: true });

  await httpServer.register(auth);

  await httpServer.register(fastifyMultipart, {
    limits: {
      fileSize: 15_000_000,
      files: 1,
    },
  });

  // Vi har inga routes tillsatta på vår httpServer
  await httpServer.register(userRoutes);
  // Vi har userRoutes tillsatta på vår httpServer

  await httpServer.register(postRoutes);

  return httpServer;
}

export default buildApp;
