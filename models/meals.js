import mongoose from 'mongoose';

const mealSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    ingredients:[{
      ingredient: {
        type: String,
        required: true,
      },
      amount: {
        type: String,
        required: true,
      },
    }],
    tags: {
      type: [String],
      required: true,
    }
  }
);

export const Meal = mongoose.model('Meals', mealSchema);