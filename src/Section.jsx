import React, { useEffect, useState } from 'react';
import styles from './App.module.css';

const Section = ({ url, requestType, requestBody, title }) => {
  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Loading.");
  const [response, setResponse] = useState(null);

  useEffect(() => {
    let loadingInterval;
    if (loading) {
      loadingInterval = setInterval(() => {
        setLoadingMessage((prev) => {
          if (prev === "Loading.") return "Loading..";
          if (prev === "Loading..") return "Loading...";
          return "Loading.";
        });
      }, 500);
    }
    return () => clearInterval(loadingInterval);
  }, [loading]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(url, {
          method: requestType,
          headers: {
            "Content-Type": "application/json",
          },
          body: requestType === "POST" ? JSON.stringify(requestBody) : null,
        });
        const data = await res.json();
        setResponse(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, [url, requestType, requestBody]);

  const formatResponse = (data) => {
    if (data.TODO) {
      return <pre>{JSON.stringify(data, null, 2)}</pre>;
    }

    if (data.error) {
      return <div>{data.error} for "{data.name}"</div>;
    }

    const { name, ...diningHalls } = data;
    const mealOrder = ["Breakfast", "Lunch", "Dinner", "Late Night"];
    const availableMeals = Object.entries(diningHalls).map(([hall, meals]) => {
      const sortedMeals = mealOrder.filter(meal => meals[meal]);
      return (
        <div key={hall} className={styles.diningHall}>
          <strong>{hall}:</strong>
          <ul className={styles.mealsList}>
            {sortedMeals.map(meal => (
              <li key={meal}>{meal}</li>
            ))}
          </ul>
        </div>
      );
    });

    return (
      <div>
        <h3>{name} is available at:</h3>
        {availableMeals}
      </div>
    );
  };

  return (
    <div className={title ? styles.section : ""}>
      {title && <h2>{title}</h2>}
      {loading ? (
        <div className={styles.loading}>{loadingMessage}</div>
      ) : (
        response && (
          <div className={styles.response}>
            {formatResponse(response)}
          </div>
        )
      )}
    </div>
  );
};

export default Section;
