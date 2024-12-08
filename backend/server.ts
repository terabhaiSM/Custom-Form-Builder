import express from 'express';
import cors from 'cors';
import formRoutes from './routes/formRoutes';

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());  // Parse JSON requests
app.use('/api/forms', formRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
