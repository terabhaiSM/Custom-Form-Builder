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

    res.status(201).json({ id: form.id, uuid: form.uuid });
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

  // POST /api/forms/:id/submissions - Submit form responses
app.post("/api/forms/:id/submissions", async (req, res) => {
    try {
      const { id } = req.params; // Form ID
      const { responses } = req.body; // User responses
  
      // Check if form exists
      const form = await prisma.form.findUnique({ where: { id } });
      if (!form) {
        return res.status(404).json({ error: "Form not found" });
      }
  
      // Save the submission
      const submission = await prisma.submission.create({
        data: {
          formId: id,
          responses,
        },
      });
  
      res.status(201).json({ message: "Submission successful", submission });
    } catch (error) {
      console.error("Error submitting form:", error);
      res.status(500).json({ error: "Failed to submit form" });
    }
  });

  // GET /api/forms/:id/submissions - Fetch all submissions for a form
app.get("/api/forms/:id/submissions", async (req, res) => {
  console.log("Fetching submissions");
  try {
    const { id } = req.params;
    console.log("Form ID:", id);

    // Fetch form submissions
    const submissions = await prisma.submission.findMany({
      where: { formId: id },
      include: { form: true }, // Optionally include form details
    });

    if (!submissions || submissions.length === 0) {
      return res.status(404).json({ error: "No submissions found for this form" });
    }

    res.status(200).json(submissions);
  } catch (error) {
    console.error("Error fetching submissions:", error);
    res.status(500).json({ error: "Failed to fetch submissions" });
  }
});
// GET /api/forms - Fetch all forms
app.get("/api/forms", async (req, res) => {
  try {
    const forms = await prisma.form.findMany({
      select: {
        id: true,
        title: true,
        description: true,
      },
    });

    if (!forms || forms.length === 0) {
      return res.status(404).json({ error: "No forms found" });
    }

    res.status(200).json(forms);
  } catch (error) {
    console.error("Error fetching forms:", error);
    res.status(500).json({ error: "Failed to fetch forms" });
  }
});
// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});