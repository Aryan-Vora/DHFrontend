import {useState, useEffect} from "react";
import styles from "./App.module.css";

function App() {
  const [food, setFood] = useState("");
  const [response, setResponse] = useState(null);
  const [daalSaagResponse, setDaalSaagResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Loading.");

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setResponse(null); // Clear previous response
    const res = await fetch("https://dhscraper.onrender.com/check_food", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({food}),
    });
    const data = await res.json();
    setResponse(data);
    setLoading(false);
  };

  useEffect(() => {
    const fetchDaalSaag = async () => {
      const res = await fetch("https://dhscraper.onrender.com/check_food", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({food: "Daal Saag"}),
      });
      const data = await res.json();
      setDaalSaagResponse(data);
    };

    fetchDaalSaag();
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Food Availability Checker</h1>
      <div className={styles.section}>
        <h2>Search Food</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            value={food}
            onChange={(e) => setFood(e.target.value)}
            placeholder="Enter food name"
            className={styles.input}
          />
          <button type="submit" className={styles.button}>
            Check Food
          </button>
        </form>
        {loading && <div className={styles.loading}>{loadingMessage}</div>}
        {response && (
          <div className={styles.response}>
            <h2>Food Availability</h2>
            <pre>{JSON.stringify(response, null, 2)}</pre>
          </div>
        )}
      </div>
      <div className={styles.section}>
        <h2>Best Menu Options</h2>
        <p>This section will provide the best menu options.</p>
      </div>
      {daalSaagResponse && (
        <div className={styles.section}>
          <h2>Daal Saag Availability</h2>
          <pre>{JSON.stringify(daalSaagResponse, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
