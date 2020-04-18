import React, { useState, useCallback } from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [toxic, setToxic] = useState(false);

  const handleChange = useCallback((event) => {
    setText(event.target.value);
  }, []);

  const checkToxicity = useCallback(() => {
    setLoading(true);
    fetch("/api/check", {
      method: "post",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    })
      .then((response) => response.json())
      .then((response) => {
        setToxic(response.toxic ? true : false);
      })
      .catch((reason) => {
        console.log(reason);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [text]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          <input
            type="text"
            value={text}
            onChange={handleChange}
            placeholder="Enter text"
          />
          <button onClick={checkToxicity}>Check</button>
        </p>
        {loading && <p>Loading...</p>}
        <p
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: toxic ? "red" : "green",
          }}>
          {toxic ? "Toxic" : "Not Toxic"}
        </p>
      </header>
    </div>
  );
}

export default App;
