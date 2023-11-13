"use client";

import { useEffect, useState } from "react";

const Book = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch("api/books")
      .then((response) => response.json())
      .then((data) => setBooks(data.books))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="bg-gradient-to-bl from-blue-50 to-violet-50 flex  justify-center lg:full">
      <div className="container mx-auto p-4 ">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {books?.map((book) => (
            <a
              key={book.id}
              className="
            lg:max-w-40
            md:w-30
            h-96
            cursor-pointer 
            rounded-lg 
            bg-white 
            p-2 
            shadow 
            duration-150 
            hover:scale-110 
            hover:shadow-md
            bg-cover
            bg-center
             "
              style={{
                backgroundImage: `url(/static/${book.image})`,
              }}
              href={`/books/${book.id}`}
            >
              {/* <h5>Testing</h5> */}
              <h1 className="text-gray-100">{book.title}</h1>
              <p className="text-gray-100">{book.year}</p>

              {/* <p>{book.image}</p> */}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Book;
