import React, { useEffect, useState } from "react";

import Header from "./Header";
import ToyForm from "./ToyForm";
import ToyContainer from "./ToyContainer";

const TOYS_URL = "http://localhost:3001/toys";

function App() {
  const [showForm, setShowForm] = useState(false);
  const [toys, setToys] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchToys() {
      try {
        const response = await fetch(TOYS_URL);
        if (!response.ok) {
          throw new Error(`Unable to load toys (${response.status}).`);
        }
        setToys(await response.json());
      } catch (requestError) {
        setError(requestError.message || "Unable to load toys.");
      }
    }

    fetchToys();
  }, []);

  function handleClick() {
    setShowForm((showForm) => !showForm);
  }

  async function handleAddToy(toyDetails) {
    try {
      const response = await fetch(TOYS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...toyDetails, likes: 0 }),
      });
      if (!response.ok) {
        throw new Error(`Unable to create toy (${response.status}).`);
      }
      const newToy = await response.json();
      setToys((currentToys) => [...currentToys, newToy]);
      setError("");
      return newToy;
    } catch (requestError) {
      setError(requestError.message || "Unable to create toy.");
      return null;
    }
  }

  async function handleDeleteToy(toyId) {
    try {
      const response = await fetch(`${TOYS_URL}/${toyId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Unable to donate toy (${response.status}).`);
      }
      setToys((currentToys) => currentToys.filter((toy) => toy.id !== toyId));
      setError("");
    } catch (requestError) {
      setError(requestError.message || "Unable to donate toy.");
    }
  }

  async function handleLikeToy(toy) {
    try {
      const response = await fetch(`${TOYS_URL}/${toy.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ likes: toy.likes + 1 }),
      });
      if (!response.ok) {
        throw new Error(`Unable to like toy (${response.status}).`);
      }
      const updatedToy = await response.json();
      setToys((currentToys) =>
        currentToys.map((currentToy) =>
          currentToy.id === updatedToy.id ? updatedToy : currentToy,
        ),
      );
      setError("");
    } catch (requestError) {
      setError(requestError.message || "Unable to like toy.");
    }
  }

  return (
    <>
      <Header />
      {error ? <p role="alert">{error}</p> : null}
      {showForm ? <ToyForm onAddToy={handleAddToy} /> : null}
      <div className="buttonContainer">
        <button onClick={handleClick}>Add a Toy</button>
      </div>
      <ToyContainer
        toys={toys}
        onLikeToy={handleLikeToy}
        onDeleteToy={handleDeleteToy}
      />
    </>
  );
}

export default App;
