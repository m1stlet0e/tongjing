import express from "express";
import cors from "cors";
import photosRouter from "./routes/photos";
import usersRouter from "./routes/users";
import equipmentRouter from "./routes/equipment";
import mapRouter from "./routes/map";

const app = express();
const port = process.env.PORT || 9091;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Health check
app.get('/api/v1/health', (req, res) => {
  console.log('Health check success');
  res.status(200).json({ status: 'ok' });
});

// Routes
app.use('/api/v1/photos', photosRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/equipment', equipmentRouter);
app.use('/api/v1/map', mapRouter);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}/`);
});
