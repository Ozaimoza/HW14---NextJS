import fs from "fs";
import path from "path";
import formidable from "formidable";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const form = new formidable.IncomingForm();

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: "Error parsing form data" });
    }

    // Ambil path file sementara
    const tempFilePath = files.file.path;

    // Buat direktori upload jika belum ada
    const uploadDir = path.join(process.cwd(), "public", "static", "upload");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Pindahkan file ke direktori upload
    const fileName = `uploaded_${Date.now()}_${files.file.name}`;
    const newFilePath = path.join(uploadDir, fileName);
    fs.renameSync(tempFilePath, newFilePath);

    // Berikan respon berhasil ke client tanpa menggunakan Axios
    res.status(200).json({ message: "File uploaded successfully", fileName });
  });
}
