const express = require("express");
const { PrismaClient } = require("@prisma/client");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// POST /api/forms - Create a new form
app.post("/api/forms", async (req, res) => {
  try {
    const { title, description, fields } = req.body;

    // Create the form
    const form = await prisma.form.create({
      data: {
        title,
        description,
        fields: {
          create: fields.map((field) => ({
            type: field.type,
            label: field.label,
            value: field.value || null,
            options: field.options || null,
          })),
        },
      },
    });

    res.status(201).json({ id: form.id });
  } catch (error) {
    console.error("Error creating form:", error);
    res.status(500).json({ error: "Failed to create form" });
  }
});

// GET /api/forms/:id - Fetch a form by ID
app.get("/api/forms/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch the form by ID
    const form = await prisma.form.findUnique({
      where: { id },
      include: { fields: true },
    });

    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }

    res.status(200).json(form);
  } catch (error) {
    console.error("Error fetching form:", error);
    res.status(500).json({ error: "Failed to fetch form" });
  }
});

// GET /api/forms/share/:uuid - Fetch a form by its UUID
app.get("/api/forms/share/:uuid", async (req, res) => {
    try {
      const { uuid } = req.params;
  
      // Fetch the form by UUID
      const form = await prisma.form.findUnique({
        where: { uuid },
        include: { fields: true },
      });
  
      if (!form) {
        return res.status(404).json({ error: "Form not found" });
      }
  
      res.status(200).json(form);
    } catch (error) {
      console.error("Error fetching form by UUID:", error);
      res.status(500).json({ error: "Failed to fetch form" });
    }
  });
  
// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});