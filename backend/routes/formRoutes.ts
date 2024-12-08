import express from 'express';
import { createForm, getFormById, getAllForms, submitForm, getFormSubmissions } from '../controller/formController';

const router = express.Router();

router.post('/', createForm); // Create a new form
router.get('/', getAllForms); // Get all forms
router.get('/:id', getFormById); // Get form by ID
router.post('/:id/submit', submitForm); // Submit a form
router.get('/:id/submissions', getFormSubmissions); // Get form submissions

export default router;
