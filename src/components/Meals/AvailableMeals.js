import Card from "../UI/Card";
import MealItem from "./MealItem/MealItem";
import classes from "./AvailableMeals.module.css";
import { useEffect, useState } from "react";

const AvailableMeals = () => {
  const [meals, setMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    const getMealsFromDB = async () => {
      try {
        const response = await fetch(
          `https://food-items-350f2-default-rtdb.firebaseio.com/meals.json`
        );
        console.log(response);
        if (!response.ok) throw new Error(`something went wrong `);
        const data = await response.json();
        console.log("try");

        const mealsData = Object.entries(data).map((meal) => {
          return {
            id: meal[0],
            name: meal[1].name,
            description: meal[1].description,
            price: meal[1].price,
          };
        });

        setIsLoading(false);
        setMeals((prevMeals) => [...prevMeals, ...mealsData]);
      } catch (error) {
        setIsLoading(false);
        console.log(error.message);
        setError(error);
      }
    };
    getMealsFromDB();
  }, []);

  if (isLoading) {
    return (
      <section className={classes.mealsLoading}>
        <p>Loading...</p>
      </section>
    );
  }
  if (error) {
    return (
      <section className={classes.fetchError}>
        <p> ⚠️ Something Wrong... {`${error.message}`}</p>
      </section>
    );
  }

  const mealsList = meals.map((meal) => (
    <MealItem
      key={meal.id}
      id={meal.id}
      name={meal.name}
      description={meal.description}
      price={meal.price}
    />
  ));

  return (
    <section className={classes.meals}>
      <Card>
        {isLoading && <p>Loading...</p>}
        {error && <p> ⚠️ Something went Wrong</p>}
        <ul>{mealsList}</ul>
      </Card>
    </section>
  );
};

export default AvailableMeals;
