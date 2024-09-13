export const shuffleMeals = (listofMeals) => {
  for (let i = listofMeals.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [listofMeals[i], listofMeals[j]] = [listofMeals[j], listofMeals[i]];
  };
  return listofMeals;
};
