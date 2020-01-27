import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default () => {
  const [authorsList, setAuthorsList] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/authors");
        const data = await response.json();
        setAuthorsList(data.authors);
      } catch (e) {
        console.log(e);
      }
    };

    fetchData();
  }, []);

  if (authorsList === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      {authorsList.map(({ name, id }) => (
        <Link key={id} to={`/author/${id}`}>
          {name}
        </Link>
      ))}
    </div>
  );
};
