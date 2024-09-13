import { Router } from 'express';
import { Meal } from '../../models/meals.js';
import { shuffleMeals } from '../../utils/shuffleMeals.js';

const routes = Router();

routes.get('/', async (req, res, next) => {
  const { noOfMeals, mealType, ...rest } = req.query;
  try {
    let meals;
    if (mealType) {
      const mealsByType = await Meal.find({ tags: mealType });
      if (!mealsByType || mealsByType.length === 0) {
        return res.status(404).json('No meal types found');
      }
      const shuffledMeals = shuffleMeals(mealsByType);

      meals = shuffledMeals.slice(0, noOfMeals);
    } else {
      meals = await Meal.find();
    };
    if (!meals || meals.length === 0) throw new Error('No meals found');
    res.status(200).json(meals);
  } catch(err) {
    next(err);
  }
});


routes.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const meal = await Meal.findById(id);

    if (!meal) throw new NotFoundError(`Meal: ${id} not found`);

    res.status(200).json(meal);
    console.log(`Meal: ${JSON.stringify(meal)}`)
  } catch(err) {
    next(err);
  }
});

routes.post('/', async (req, res, next) => {
  const mealToAdd = {...req.body};
  const name = mealToAdd.name;
  try {
    const mealExists = await Meal.find({name: name}).lean();
    if (mealExists.length > 0) throw new Error(`This meal already exists`);

    console.log('MEAL TO ADD', JSON.stringify(mealToAdd, null, 2));
    const meal = await Meal.create(mealToAdd);

    res.status(200).send(meal.toObject());
  } catch (err) {
    console.log('Error', err);
    next(err);
  }
});

routes.patch('/:id', async (req, res, next) => {
  const mealId = req.params.id;
  const mealUpdateDetails = {...req.body};
  try {
    const meal = await Meal.findById(mealId);
    if (!meal) throw new NotFoundError(`Meal: ${mealId} not found`);

    const getNewMealName = (mealDetails) => {
      const newMealName = mealDetails.name;
      if (newMealName === meal.name) return null;
      return { 'name': newMealName };
    }

    // const getIngredient = (mealDetails) => {
    //     const updatedIngredient = mealDetails.ingredient;
    //     if (updatedIngredient === )
    //   return { 'ingredients': [{ 'ingredient': updatedIngredient }] };
    // }

    // update ingredient name or amount - patch update to meal ingredient based on ingredient id
    // add ingredient

    const updateMealName = getNewMealName(mealUpdateDetails);
    // const updateIngredient = getIngredient(mealUpdateDetails);

    const updates = {
      $set: {
        ...updateMealName,
        // ...updateIngredient,
      },
    };

    const mealUpdate = await Meal.findOneAndUpdate({_id: mealId}, updates, { new: true });

    res.status(200).json(mealUpdate);
    console.log(`Meal updated: ${JSON.stringify(mealUpdate)}`)
  } catch (err) {
    console.log(err);
    next(err);
  }
});

export default routes;