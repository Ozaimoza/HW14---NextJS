import { PrismaClient } from "@prisma/client";
import authenticateTokenMiddleware from "../../../../utils/authenticateTokenMiddleware";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  switch (req.method) {
    case "PUT":
      return editBook(req, res); // Meneruskan req dan res ke editBook
    case "DELETE":
      return deleteBook(req, res); // Meneruskan req dan res ke deleteBook
    case "GET":
      return getBookById(Number(id), res);
    default:
      return res.status(405).json({ massage: "Method Not Allowed" }).end(); // Method Not Allowed
  }
}

const editBook = async (req, res) => {
  const { id } = req.query;
  const { title, author, publisher, year, pages } = req.body;

  authenticateTokenMiddleware(req, res, async () => {
    try {
      const book = await prisma.book.update({
        where: { id: Number(id) },
        data: {
          title,
          author,
          publisher,
          year,
          pages,
        },
      });
      res.json({ book });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: "Something went wrong" });
    }
  });
};

const deleteBook = async (req, res) => {
  const { id } = req.query;

  authenticateTokenMiddleware(req, res, async () => {
    try {
      const book = await prisma.book.delete({
        where: { id: Number(id) },
      });
      res.json({ massage: "Successfuly Delete", data: book });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "Something went wrong" });
    }
  });
};

const getBookById = async (id, res) => {
  try {
    const book = await prisma.book.findUnique({
      where: { id },
    });
    res.json({ book });
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: "Something went wrong" });
  }
};
