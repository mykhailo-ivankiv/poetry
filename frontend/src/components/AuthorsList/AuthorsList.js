import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BEM from "../../utils/BEM.js";
import "./AuthorsList.css";
const b = BEM("AuthorsList");

export default () => {
  const [authorsList, setAuthorsList] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/authors");
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
    <div className={b()}>
      {authorsList.map(({ name, id }) => (
        <>
          <Link key={id} to={`/author/${id}`}>
            {name}
          </Link>
          &nbsp;
        </>
      ))}
    </div>
  );
};
