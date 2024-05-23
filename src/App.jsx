// src/App.jsx
import {useState} from "react";

function App() {
  const [food, setFood] = useState("");
  const [response, setResponse] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const res = await fetch(
      "https://your-backend-url.onrender.com/check_food",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({food}),
      }
    );
    const data = await res.json();
    setResponse(data);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={food}
          onChange={(e) => setFood(e.target.value)}
          placeholder="Enter food name"
        />
        <button type="submit">Check Food</button>
      </form>
      {response && (
        <div>
          <h2>Food Availability</h2>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
