import React, { useEffect, useState } from "react";
// CSS
import BEM from "../../utils/BEM.js";
import "./Poem.css";

const b = BEM("Poem");

export default ({ id }) => {
  const [poem, setPoem] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/poems/${id}`);
        const data = await response.json();
        setPoem(data);
      } catch (e) {
        console.log(e);
      }
    };

    fetchData();
  }, []);

  if (!poem) return <article>Loading...</article>;

  const { title, html } = poem;

  return (
    <article className={b()}>
      <h4>{title}</h4>
      <p className={b("text")}>{html}</p>
    </article>
  );
};
