const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Swagger Options
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Form API",
      version: "1.0.0",
      description: "API documentation for managing forms and submissions.",
    },
    servers: [
      {
        url: "http://localhost:5001",
        description: "Local server",
      },
    ],
  },
  apis: ["./controllers/*.js"], // Path to the API docs
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
const formRoutes = require("./routes/formRoutes");
const submissionRoutes = require("./routes/submissionRoutes");

app.use("/api/forms", formRoutes);
app.use("/api/forms", submissionRoutes);

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});