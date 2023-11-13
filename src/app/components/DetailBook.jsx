"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const DetailBook = ({ params }) => {
  const token =
    typeof window !== "undefined" ? window.localStorage.getItem("token") : null;
  //   console.log(token);
  const router = useRouter();
  const [bookDetails, setBookDetails] = useState(null);
  const [editedBook, setEditedBook] = useState({
    title: "",
    author: "",
    publisher: "",
    year: "",
    pages: "",
  });

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await fetch(`/api/books/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setBookDetails(data.book);
        } else {
          console.error("Error fetching book details");
        }
      } catch (error) {
        console.error("Error fetching book details:", error);
      }
    };

    if (params.id) {
      fetchBookDetails();
    }
  }, [params.id]);

  useEffect(() => {
    // Update editedBook whenever bookDetails changes
    if (bookDetails) {
      setEditedBook({
        title: bookDetails.title || "",
        author: bookDetails.author || "",
        publisher: bookDetails.publisher || "",
        year: bookDetails.year || "",
        pages: bookDetails.pages || "",
      });
    }
  }, [bookDetails]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setEditedBook((prevBook) => ({
      ...prevBook,
      [name]: name === "year" || name === "pages" ? parseInt(value, 10) : value,
    }));
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const token = window.localStorage.getItem("token");
      const response = await fetch(`/api/books/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editedBook),
      });

      if (response.ok) {
        console.log("Book edited successfully");
      } else {
        console.error("Error editing book:", response.statusText);
      }
    } catch (error) {
      console.error("Error editing book:", error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this book?")) {
      return;
    }

    try {
      const token = window.localStorage.getItem("token");
      const response = await fetch(`/api/books/${params.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        console.log("Book deleted successfully");
        router.push("/");
      } else {
        console.error("Error deleting book:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting book:", error); // Log the error details
    }
  };

  if (!bookDetails) {
    return (
      <>
        {/* Loading state */}
        <div className="container mx-auto ">
          <div className="flex justify-center px-6 my-12">
            <div className="w-full xl:w-3/4 lg:w-11/12 flex">
              <div className="w-full h-auto bg-gray-300 hidden lg:block lg:w-4/12 bg-cover rounded-l-lg"></div>
              <div className="w-full lg:w-8/12 bg-gray-300 p-5 rounded-lg lg:rounded-l-none"></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* <!-- Container --> */}
      <div className="container mx-auto ">
        <div className="flex justify-center px-6 my-12">
          {/* <!-- Row --> */}
          <div className="w-full xl:w-3/4 lg:w-11/12 flex">
            {/* <!-- Col --> */}
            <div className="w-full h-auto bg-gray-100 hidden lg:block lg:w-4/12 bg-cover rounded-l-lg">
              <img
                src={`/static/${bookDetails.image}`}
                alt="Selected Book"
                className="w-full h-full object-cover rounded-l-lg"
              />
            </div>

            {/* <!-- Col --> */}
            <div className="w-full lg:w-8/12 bg-white p-5 rounded-lg lg:rounded-l-none">
              <h3 className="pt-4 text-2xl text-center">Detail Book !</h3>
              <form
                className="px-8 pt-6 pb-8 mb-4 bg-white rounded"
                // onSubmit={handleSubmit}
              >
                <div className="mb-4">
                  <label
                    className="block mb-2 text-sm font-bold text-gray-700"
                    htmlFor="title"
                  >
                    Title
                  </label>
                  <input
                    className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                    placeholder={`Title (${
                      bookDetails.title || "Previous Title"
                    })`}
                    type="text"
                    id="title"
                    name="title"
                    value={editedBook.title}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-4 md:flex md:justify-between">
                  <div className="mb-4 md:mr-2 md:mb-0">
                    <label
                      className="block mb-2 text-sm font-bold text-gray-700"
                      htmlFor="author"
                    >
                      Author
                    </label>
                    <input
                      className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                      placeholder={`Author (${
                        bookDetails.author || "Previous Author"
                      })`}
                      type="text"
                      id="author"
                      name="author"
                      value={editedBook.author}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="md:ml-2">
                    <label
                      className="block mb-2 text-sm font-bold text-gray-700"
                      htmlFor="publisher"
                    >
                      Publisher
                    </label>
                    <input
                      className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                      placeholder={`Publisher (${
                        bookDetails.publisher || "Previous Publisher"
                      })`}
                      type="text"
                      id="publisher"
                      name="publisher"
                      value={editedBook.publisher}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="mb-4 md:flex md:justify-between">
                  <div className="mb-4 md:mr-2 md:mb-0">
                    <label
                      className="block mb-2 text-sm font-bold text-gray-700"
                      htmlFor="year"
                    >
                      Year
                    </label>
                    <input
                      className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                      placeholder={`Year (${
                        bookDetails.year || "Previous Year"
                      })`}
                      type="number"
                      id="year"
                      name="year"
                      value={editedBook.year}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="md:ml-2">
                    <label
                      className="block mb-2 text-sm font-bold text-gray-700"
                      htmlFor="pages"
                    >
                      Pages
                    </label>
                    <input
                      className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                      placeholder={`Pages (${
                        bookDetails.pages || "Previous Pages"
                      })`}
                      type="number"
                      id="pages"
                      name="pages"
                      value={editedBook.pages}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {token ? (
                  <div>
                    <hr className="mb-6 border-t" />
                    <div className="mb-6 text-center">
                      <button
                        className="w-full px-4 py-2 font-bold text-white bg-yellow-500 rounded-full hover:bg-yellow-700 focus:outline-none focus:shadow-outline"
                        type="button"
                        onClick={handleEdit}
                      >
                        EDIT
                      </button>
                    </div>
                    <hr className="mb-6 border-t" />
                    <div className="mb-6 text-center">
                      <button
                        className="w-full px-4 py-2 font-bold text-white bg-red-500 rounded-full hover:bg-red-700 focus:outline-none focus:shadow-outline"
                        type="button"
                        onClick={handleDelete}
                      >
                        DELETE
                      </button>
                    </div>
                  </div>
                ) : null}
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailBook;
