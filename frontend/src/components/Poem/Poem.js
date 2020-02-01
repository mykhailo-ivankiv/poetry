import React, { useEffect, useState } from "react";
// CSS
import BEM from "../../utils/BEM.js";
import "./Poem.css";

const b = BEM("Poem");

export default ({ id: authorId }) => {
  const [poem, setPoem] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/poems/${authorId}`
        );
        const data = await response.json();
        setPoem(data);
      } catch (e) {
        console.log(e);
      }
    };

    fetchData();
  }, []);

  if (!poem) return <article>Loading...</article>;

  const { title, html, id: poemId } = poem;

  return (
    <article className={b()}>
      <h4>{title}</h4>
      <p id={authorId} className={b("text")}>
        {html}
      </p>
    </article>
  );
};
