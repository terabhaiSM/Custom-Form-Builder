import { Request, Response } from 'express';
import prisma from '../prisma/client';

// Create a new form
export const createForm = async (req: Request, res: Response) => {
  try {
    const { title, description, fields } = req.body;

    const form = await prisma.form.create({
      data: {
        title,
        description,
        fields: {
          create: fields,
        },
      },
    });

    res.status(201).json(form);
  } catch (error) {
    res.status(500).json({ error: 'Error creating form' });
  }
};

// Get all forms
export const getAllForms = async (req: Request, res: Response) => {
  try {
    const forms = await prisma.form.findMany();
    res.status(200).json(forms);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching forms' });
  }
};

// Get a single form by ID
export const getFormById = async (req, res) => {
  try {
    const formId = req.params.id;
    const form = await prisma.form.findUnique({
      where: { id: formId },
      include: { fields: true },
    });

    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    res.status(200).json(form);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching form' });
  }
};

// Submit a form
export const submitForm = async (req: Request, res: Response) => {
  try {
    const formId = req.params.id;
    const { userId, data } = req.body;

    const submission = await prisma.submission.create({
      data: {
        formId,
        userId,
        data,
      },
    });

    res.status(201).json(submission);
  } catch (error) {
    res.status(500).json({ error: 'Error submitting form' });
  }
};

// Get submissions for a form
export const getFormSubmissions = async (req: Request, res: Response) => {
  try {
    const formId = req.params.id;
    const submissions = await prisma.submission.findMany({
      where: { formId },
    });

    res.status(200).json(submissions);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching submissions' });
  }
};
