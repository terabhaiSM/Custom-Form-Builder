const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * @swagger
 * /api/forms/{id}/submissions:
 *   post:
 *     summary: Submit responses for a form
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
 *               responses:
 *                 type: object
 *                 additionalProperties:
 *                   type: string
 *     responses:
 *       201:
 *         description: Submission successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 submission:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     formId:
 *                       type: string
 *                     responses:
 *                       type: object
 *                       additionalProperties:
 *                         type: string
 *       404:
 *         description: Form not found
 *       500:
 *         description: Failed to submit form
 */
exports.submitForm = async (req, res) => {
  try {
    const { id } = req.params;
    const { responses } = req.body;

    const form = await prisma.form.findUnique({ where: { id } });
    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }

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
};

/**
 * @swagger
 * /api/forms/{id}/submissions:
 *   get:
 *     summary: Fetch submissions for a form by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The form ID
 *     responses:
 *       200:
 *         description: Submissions fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 formTitle:
 *                   type: string
 *                 formDescription:
 *                   type: string
 *                 submissions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       submissionId:
 *                         type: string
 *                       submittedAt:
 *                         type: string
 *                         format: date-time
 *                       responses:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             question:
 *                               type: string
 *                             type:
 *                               type: string
 *                             options:
 *                               type: array
 *                               items:
 *                                 type: string
 *                             answer:
 *                               type: string
 *       404:
 *         description: Form not found
 *       500:
 *         description: Failed to fetch submissions
 */
exports.getSubmissionsByFormId = async (req, res) => {
  try {
    const { id } = req.params;

    const form = await prisma.form.findUnique({
      where: { id },
      include: { fields: true },
    });

    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    const submissions = await prisma.submission.findMany({
      where: { formId: id },
    });

    if (!submissions) {
      return res.status(404).json({
        formTitle: form.title,
        formDescription: form.description,
        submissions: [],
      });
    }

    const detailedSubmissions = submissions.map((submission) => {
      const responses = submission.responses;
      const pairedQuestionsAndAnswers = form.fields.map((field) => ({
        question: field.label,
        type: field.type,
        options: field.options,
        answer: responses[field.id] || null,
      }));
      return {
        submissionId: submission.id,
        submittedAt: submission.createdAt,
        responses: pairedQuestionsAndAnswers,
      };
    });

    res.status(200).json({
      formTitle: form.title,
      formDescription: form.description,
      submissions: detailedSubmissions,
    });
  } catch (error) {
    console.error("Error fetching submissions with form details:", error);
    res.status(500).json({ error: "Failed to fetch submissions" });
  }
};