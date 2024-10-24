import swaggerJsDoc from 'swagger-jsdoc';

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: "API EventosApp",
      version: "1.0.0",
      description: "API para gerenciamento de eventos e usuários",
      contact: {
        name: "Suporte",
        email: "suporte@eventosapp.com"
      }
    },
    servers: [
      {
        url: `http://localhost:3000`, // Altere conforme o ambiente
      }
    ],
    components: {
      schemas: {
        Usuario: {
          type: "object",
          properties: {
            id: { type: "string" },
            nome: { type: "string" },
            email: { type: "string" },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            message: { type: "string" },
          },
        },
      },
    },
  },
  apis: ['./src/http/**/*.ts'],
};

export const swaggerDocs = swaggerJsDoc(swaggerOptions);
