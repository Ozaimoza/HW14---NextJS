import { PrismaClient } from "@prisma/client";
import authenticateTokenMiddleware from "../../../../utils/authenticateTokenMiddleware";
import * as formidable from "formidable";
import fs from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req, res) => {
  switch (req.method) {
    case "POST":
      return createBook(req, res);
    case "GET":
      return getAllBooks(req, res);
    default:
      return res.status(405).json({ message: "Method Not Allowed" }).end();
  }
};

const createBook = async (req, res) => {
  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    // console.log("Fields:", fields);
    if (err) {
      console.error("Error parsing form data:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }

    // const { title, author, publisher, year, pages } = fields;
    const imageFile = files.image[0];

    // Pastikan direktori 'public/static/uploads' sudah ada
    const uploadDirectory = path.join(process.cwd(), "public/static/uploads");

    try {
      await fs.mkdir(uploadDirectory, { recursive: true });
    } catch (error) {
      console.error("Error creating directory:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }

    const fileName = `${Date.now()}-${imageFile.originalFilename}`;
    const filePath = path.join(uploadDirectory, fileName);

    try {
      // Periksa apakah imageFile.path terdefinisi sebelum digunakan
      if (imageFile && imageFile.filepath) {
        // Gunakan modul fs untuk memindahkan file ke direktori tujuan
        await fs.copyFile(imageFile.filepath, filePath);
      } else {
        console.error("Error moving file: imageFile.path is undefined");
        return res.status(500).json({ message: "Internal Server Error" });
      }
    } catch (error) {
      console.error("Error moving file:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }

    const data = {
      title: String(fields.title),
      author: String(fields.author),
      publisher: String(fields.publisher),
      year: parseInt(fields.year),
      pages: parseInt(fields.pages),
      image: `uploads/${fileName}`,
    };

    try {
      // Gunakan data untuk membuat buku dalam database
      const book = await prisma.book.create({
        data: data,
      });

      res.json({ book });
    } catch (error) {
      console.error("Error creating book:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
};

const getAllBooks = async (req, res) => {
  try {
    const books = await prisma.book.findMany();
    res.json({ books });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Something went wrong" });
  }
};

export default handler;
