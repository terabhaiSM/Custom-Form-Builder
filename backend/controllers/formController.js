const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * @swagger
 * /api/forms:
 *   post:
 *     summary: Create a new form
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               fields:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                     label:
 *                       type: string
 *                     value:
 *                       type: string
 *                     options:
 *                       type: array
 *                       items:
 *                         type: string
 *     responses:
 *       201:
 *         description: Form created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 uuid:
 *                   type: string
 *       500:
 *         description: Failed to create form
 */
exports.createForm = async (req, res) => {
  try {
    const { title, description, fields } = req.body;

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
};

/**
 * @swagger
 * /api/forms/{id}:
 *   put:
 *     summary: Update an existing form
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The form ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               fields:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     type:
 *                       type: string
 *                     label:
 *                       type: string
 *                     value:
 *                       type: string
 *                     options:
 *                       type: array
 *                       items:
 *                         type: string
 *     responses:
 *       200:
 *         description: Form updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 fields:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       type:
 *                         type: string
 *                       label:
 *                         type: string
 *                       value:
 *                         type: string
 *                       options:
 *                         type: array
 *                         items:
 *                           type: string
 *       500:
 *         description: Failed to update form
 */
exports.updateForm = async (req, res) => {
  const { id } = req.params;
  const { title, description, fields } = req.body;

  try {
    const updatedForm = await prisma.form.update({
      where: { id },
      data: {
        title,
        description,
        fields: {
          upsert: fields.map((field) => ({
            where: { id: field.id || 0 },
            update: {
              type: field.type,
              label: field.label,
              options: field.options,
              value: field.value,
            },
            create: {
              type: field.type,
              label: field.label,
              options: field.options,
              value: field.value,
            },
          })),
        },
      },
    });

    res.status(200).json(updatedForm);
  } catch (error) {
    console.error("Error updating form:", error);
    res.status(500).json({ error: "Failed to update form." });
  }
};

/**
 * @swagger
 * /api/forms/{id}:
 *   delete:
 *     summary: Delete a form by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The form ID
 *     responses:
 *       200:
 *         description: Form deleted successfully
 *       500:
 *         description: Failed to delete form
 */
exports.deleteForm = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.field.deleteMany({ where: { formId: id } });
    await prisma.submission.deleteMany({ where: { formId: id } });
    await prisma.form.delete({ where: { id } });

    res.status(200).json({ message: "Form deleted successfully" });
  } catch (error) {
    console.error("Error deleting form:", error);
    res.status(500).json({ error: "Failed to delete form" });
  }
};

/**
 * @swagger
 * /api/forms/{id}:
 *   get:
 *     summary: Fetch a form by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The form ID
 *     responses:
 *       200:
 *         description: Form fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 uuid:
 *                   type: string
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 fields:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       type:
 *                         type: string
 *                       label:
 *                         type: string
 *                       value:
 *                         type: string
 *                       options:
 *                         type: array
 *                         items:
 *                           type: string
 *       404:
 *         description: Form not found
 *       500:
 *         description: Failed to fetch form
 */
exports.getFormById = async (req, res) => {
  try {
    const { id } = req.params;

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
};

/**
 * @swagger
 * /api/forms/share/{uuid}:
 *   get:
 *     summary: Fetch a form by its UUID
 *     parameters:
 *       - in: path
 *         name: uuid
 *         required: true
 *         schema:
 *           type: string
 *         description: The form UUID
 *     responses:
 *       200:
 *         description: Form fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 uuid:
 *                   type: string
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 fields:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       type:
 *                         type: string
 *                       label:
 *                         type: string
 *                       value:
 *                         type: string
 *                       options:
 *                         type: array
 *                         items:
 *                           type: string
 *       404:
 *         description: Form not found
 *       500:
 *         description: Failed to fetch form
 */
exports.getFormByUUID = async (req, res) => {
  try {
    const { uuid } = req.params;

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
};

/**
 * @swagger
 * /api/forms:
 *   get:
 *     summary: Fetch all forms
 *     responses:
 *       200:
 *         description: Forms fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   uuid:
 *                     type: string
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *       404:
 *         description: No forms found
 *       500:
 *         description: Failed to fetch forms
 */
exports.getAllForms = async (req, res) => {
  try {
    const forms = await prisma.form.findMany({
      select: {
        id: true,
        uuid: true,
        title: true,
        description: true,
      },
    });

    if (!forms || forms.length === 0) {
      return res.status(404).json({ message: "No forms found" });
    }

    res.status(200).json(forms);
  } catch (error) {
    console.error("Error fetching forms:", error);
    res.status(500).json({ error: "Failed to fetch forms" });
  }
};