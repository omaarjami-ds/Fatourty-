import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fatourty';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Schemas
const livreurSchema = new mongoose.Schema({
  nom: String,
  NumTel: String,
  Pourcentage: Number,
  CIN: String,
  DateDepart: String,
  etat: { type: String, default: 'Actif' }
}, { toJSON: { virtuals: true }, toObject: { virtuals: true } });

livreurSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

const motorSchema = new mongoose.Schema({
  NumPlaque: String,
  Kilometrage: Number,
  Color: String
}, { toJSON: { virtuals: true }, toObject: { virtuals: true } });

motorSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

const journeeSchema = new mongoose.Schema({
  Date: String,
  LivreurId: String,
  MotorId: String,
  Recette: Number,
  TotalDeponse: Number,
  PartieLivreur: Number,
  Net: Number
}, { toJSON: { virtuals: true }, toObject: { virtuals: true } });

journeeSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

const Livreur = mongoose.model('Livreur', livreurSchema);
const Motor = mongoose.model('Motor', motorSchema);
const Journee = mongoose.model('Journee', journeeSchema);

// Generic CRUD helper
const createCRUD = (model, name) => {
  app.get(`/${name}`, async (req, res) => {
    try {
      const data = await model.find();
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get(`/${name}/:id`, async (req, res) => {
    try {
      const data = await model.findById(req.params.id);
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post(`/${name}`, async (req, res) => {
    try {
      const newData = new model(req.body);
      const savedData = await newData.save();
      res.status(201).json(savedData);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put(`/${name}/:id`, async (req, res) => {
    try {
      const updatedData = await model.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(updatedData);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete(`/${name}/:id`, async (req, res) => {
    try {
      await model.findByIdAndDelete(req.params.id);
      res.json({ message: 'Deleted' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
};

createCRUD(Livreur, 'Livreur');
createCRUD(Motor, 'Motor');
createCRUD(Journee, 'Journee');

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
