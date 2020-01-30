import React, { useEffect, useState } from "react";

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
    <article>
      <h4>{title}</h4>
      <textarea name="" id="" cols="30" rows="10" defaultValue={html} />
    </article>
  );
};
