const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors()); // Allows your HTML file to communicate with this server
app.use(express.json());

// Connect to MongoDB Atlas
const mongoURI = 'mongodb+srv://abhinavantham_db_user:@cluster0.suelbpi.mongodb.net/college_predictor?appName=Cluster0';
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Define the College Schema
const CollegeSchema = new mongoose.Schema({
  name: String,
  category: String,
  closingRank: Number
});
const College = mongoose.model('College', CollegeSchema, 'cutoffs');

// API Endpoint to predict colleges
app.post('/api/predict', async (req, res) => {
  const { rank, category } = req.body;

  try {
    // Find colleges where the closing rank is greater than or equal to the student's rank
    const eligibleColleges = await College.find({
      category: category,
      closingRank: { $gte: rank }
    }).sort({ closingRank: 1 }); // Sort by closest rank

    res.json(eligibleColleges);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));