import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

const ImageUpload = () => {
  const [selectedImages, setSelectedImages] = useState();
  const onDrop = useCallback((acceptedFiles) => {
    setSelectedImages(
      acceptedFiles.map((file) =>
        Object.assign(file, { preview: URL.createObjectURL(file) })
      )
    );
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
  });
  const selected_images = selectedImages?.map((file, index) => (
    <div key={index}>
      <img src={file.preview} style={{ width: "200px" }} alt="" />
    </div>
  ));

  return (
    <div>
      {selected_images}
      <div {...getRootProps()}>
        <input {...getInputProps()} />

        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
    </div>
  );
};

export default ImageUpload;
