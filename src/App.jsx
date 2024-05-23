import {useState, useEffect} from "react";
import styles from "./App.module.css";

function App() {
  const [food, setFood] = useState("");
  const [response, setResponse] = useState(null);
  const [daalSaagResponse, setDaalSaagResponse] = useState(null);
  const [bestFoodResponse, setBestFoodResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingDaalSaag, setLoadingDaalSaag] = useState(true);
  const [loadingBestFood, setLoadingBestFood] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Loading.");
  const [suggestions, setSuggestions] = useState([]);
  const [items, setItems] = useState([]);
  const handleChange = (event) => {
    const value = event.target.value;
    setFood(value);

    if (value.length > 0) {
      const filteredSuggestions = items
        .filter((item) => item.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 5); // This will limit the suggestions to the first 5
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };
  useEffect(() => {
    let loadingInterval;
    if (loading || loadingDaalSaag || loadingBestFood) {
      loadingInterval = setInterval(() => {
        setLoadingMessage((prev) => {
          if (prev === "Loading.") return "Loading..";
          if (prev === "Loading..") return "Loading...";
          return "Loading.";
        });
      }, 500);
    }
    return () => clearInterval(loadingInterval);
  }, [loading, loadingDaalSaag, loadingBestFood]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setResponse(null); // Clear previous response
    try {
      const res = await fetch("https://dhscraper.onrender.com/check_food", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({food}),
      });
      const data = await res.json();
      const orderedData = {
        name: data.name,
        ...Object.keys(data)
          .filter((key) => key !== "name")
          .reduce((obj, key) => {
            obj[key] = {
              Breakfast: data[key].Breakfast,
              Lunch: data[key].Lunch,
              Dinner: data[key].Dinner,
              "Late Night": data[key]["Late Night"] || false,
            };
            return obj;
          }, {}),
      };
      setResponse(orderedData);
    } catch (error) {
      console.error("Error fetching food data:", error);
    }
    setLoading(false);
  };
  useEffect(() => {
    const fetchDaalSaag = async () => {
      try {
        const res = await fetch("https://dhscraper.onrender.com/check_food", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({food: "Daal Saag"}),
        });
        const data = await res.json();
        setDaalSaagResponse(data);
      } catch (error) {
        console.error("Error fetching Daal Saag data:", error);
      }
      setLoadingDaalSaag(false);
    };

    const fetchBestFood = async () => {
      try {
        const res = await fetch("https://dhscraper.onrender.com/best_food", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        setBestFoodResponse(data);
      } catch (error) {
        console.error("Error fetching best food data:", error);
      }
      setLoadingBestFood(false);
    };
    fetchBestFood();
    fetchDaalSaag();
  }, []);
  useEffect(() => {
    // Load items from items.txt
    fetch("items.txt")
      .then((response) => response.text())
      .then((data) => setItems(data.split("\n").map((item) => item.trim())));
  }, []);
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>DHScraper</h1>
      <div className={styles.section}>
        <h2>Search Food</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            value={food}
            onChange={handleChange}
            placeholder="Enter food name"
            className={styles.input}
            list="suggestions"
          />
          <datalist id="suggestions">
            {suggestions.map((suggestion, index) => (
              <option key={index} value={suggestion} />
            ))}
          </datalist>
          <button type="submit" className={styles.button}>
            Check Food
          </button>
        </form>
        {loading && <div className={styles.loading}>{loadingMessage}</div>}
        {response && (
          <div className={styles.response}>
            <h2>Food Availability</h2>
            <pre>{JSON.stringify(response, null, 1)}</pre>
          </div>
        )}
      </div>
      <div className={styles.section}>
        <h2>Best Foods</h2>
        {loadingBestFood ? (
          <div className={styles.loading}>{loadingMessage}</div>
        ) : (
          bestFoodResponse && (
            <div className={styles.response}>
              <pre>{JSON.stringify(bestFoodResponse, null, 2)}</pre>
            </div>
          )
        )}
      </div>
      <div className={styles.section}>
        <h2>Daal Saag Availability</h2>
        {loadingDaalSaag ? (
          <div className={styles.loading}>{loadingMessage}</div>
        ) : (
          daalSaagResponse && (
            <div className={styles.response}>
              <pre>{JSON.stringify(daalSaagResponse, null, 2)}</pre>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default App;
