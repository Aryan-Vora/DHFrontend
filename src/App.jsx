import { useState, useEffect } from "react";
import styles from "./App.module.css";
import Section from "./Section";

function App() {
  const [food, setFood] = useState("");
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [items, setItems] = useState([]);
  const [sectionKey, setSectionKey] = useState(0); // Add a state for the key

  const handleChange = (event) => {
    const value = event.target.value;
    setFood(value);

    if (value.length > 0) {
      const filteredSuggestions = items
        .filter((item) => item.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 5); // Limit the suggestions to the first 5
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setQuery(food);
    setSectionKey((prevKey) => prevKey + 1); // Increment the key to force re-render
  };

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
        {query && (
          <Section
            key={sectionKey} // Use the key to force re-render
            url="https://dhscraper.onrender.com/check_food"
            requestType="POST"
            requestBody={{ food: query }}
          />
        )}
      </div>

      <Section
        url="https://dhscraper.onrender.com/check_food"
        requestType="POST"
        requestBody={{ food: "Daal Saag" }}
        title="Daal Saag Availability"
      />
    </div>
  );
}

export default App;
