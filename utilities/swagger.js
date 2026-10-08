import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.2.0",
    info: {
      title: "Task Manager API",
      version: "1.0.0",
      description: "API documentation for our task manager backend",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./router/*.js"], // Where your route files live
};

export const swaggerSpec = swaggerJSDoc(options);
