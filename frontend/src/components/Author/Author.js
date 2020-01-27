import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Poem from "../Poem/Poem.js";

export default () => {
  let { id } = useParams();

  const [author, setAuthor] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/authors/${id}`);
        const data = await response.json();
        setAuthor(data);
      } catch (e) {
        console.log(e);
      }
    };

    fetchData();
  }, []);

  if (!author) {
    return <div>Loading...</div>;
  }

  const { name, poems } = author;

  return (
    <div>
      <h2>{name}</h2>

      {poems.map(id => (
        <Poem id={id} />
      ))}
    </div>
  );
};
