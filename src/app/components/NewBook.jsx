"use client";
import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

const CreateBookForm = () => {
  const [bookInfo, setBookInfo] = useState({
    title: "",
    author: "",
    publisher: "",
    year: "",
    pages: "",
    image: null,
  });

  const [selectedImages, setSelectedImages] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];

    // Update the bookInfo state with the file path using a functional update
    setBookInfo((prevBookInfo) => ({
      ...prevBookInfo,
      image: file,
    }));

    // Update the selectedImages state for display purposes
    setSelectedImages(
      acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )
    );
  }, []);

  const selectedImagesDisplay = selectedImages?.map((file, index) => (
    <div
      key={index}
      className="w-full h-auto bg-gray-400 hidden lg:block lg:w-5/12 bg-cover rounded-l-lg"
      style={{
        backgroundImage: `url(${file.preview})`,
      }}
    ></div>
  ));

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [".jpg", ".jpeg", ".png"],
    },
    onDrop,
    multiple: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookInfo((prevBookInfo) => ({ ...prevBookInfo, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Book Info:", bookInfo);

    // Buat FormData
    const formData = new FormData();
    formData.append("title", bookInfo.title);
    formData.append("author", bookInfo.author);
    formData.append("publisher", bookInfo.publisher);
    formData.append("year", bookInfo.year);
    formData.append("pages", bookInfo.pages);
    formData.append("image", bookInfo.image);

    // Simulasi permintaan ke server untuk mengirim data buku
    try {
      const response = await fetch("/api/books", {
        method: "POST",
        body: formData, // Menggunakan FormData sebagai body
      });

      if (response.ok) {
        console.log("Book created successfully!");
        // Reset formulir setelah membuat buku
        setBookInfo({
          title: "",
          author: "",
          publisher: "",
          year: "",
          pages: "",
          image: null,
        });
        setSelectedImages([]);
      } else {
        console.error("Error creating book");
      }
    } catch (error) {
      console.error("Error creating book:", error);
    }
  };

  return (
    <>
      {/* <!-- Container --> */}
      <div className="container mx-auto ">
        <div className="flex justify-center px-6 my-12">
          {/* <!-- Row --> */}
          <div className="w-full xl:w-3/4 lg:w-11/12 flex">
            {/* <!-- Col --> */}
            <div className="w-full h-auto bg-gray-100 hidden lg:block lg:w-5/12 bg-cover rounded-l-lg">
              {selectedImages.length > 0 && (
                <img
                  src={selectedImages[0].preview}
                  alt="Selected Book"
                  className="w-full h-auto object-cover rounded-l-lg"
                />
              )}
            </div>

            {/* <!-- Col --> */}
            <div className="w-full lg:w-7/12 bg-white p-5 rounded-lg lg:rounded-l-none">
              <h3 className="pt-4 text-2xl text-center">Create New Book !</h3>
              <form
                className="px-8 pt-6 pb-8 mb-4 bg-white rounded"
                onSubmit={handleSubmit}
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
                    placeholder="Title"
                    type="text"
                    id="title"
                    name="title"
                    value={bookInfo.title}
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
                      className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                      placeholder="Author"
                      type="text"
                      id="author"
                      name="author"
                      value={bookInfo.author}
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
                      className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                      placeholder="Publisher"
                      type="text"
                      id="publisher"
                      name="publisher"
                      value={bookInfo.publisher}
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
                      placeholder="Year"
                      type="number"
                      id="year"
                      name="year"
                      value={bookInfo.year}
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
                      placeholder="Pages"
                      type="number"
                      id="pages"
                      name="pages"
                      value={bookInfo.pages}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="mb-6 text-center">
                  <div>
                    {selectedImagesDisplay}
                    <div {...getRootProps()} style={dropzoneStyles}>
                      <input {...getInputProps()} />
                      <p>
                        {selectedImages.length > 0
                          ? `Selected File: ${selectedImages[0].name}`
                          : "Drag 'n' drop an image here, or click to select a file"}
                      </p>
                    </div>
                  </div>
                </div>
                <hr className="mb-6 border-t" />
                <div className="mb-6 text-center">
                  <button
                    className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline"
                    type="submit"
                  >
                    CREATE BOOK
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const dropzoneStyles = {
  border: "2px dashed #cccccc",
  borderRadius: "4px",
  padding: "20px",
  textAlign: "center",
  cursor: "pointer",
};

export default CreateBookForm;
