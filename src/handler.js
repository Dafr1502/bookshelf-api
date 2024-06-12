/* eslint-disable linebreak-style */
/* eslint-disable no-shadow */
/* eslint-disable no-undef */
/* eslint-disable max-len */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-vars */

const { nanoid } = require('nanoid');
const books = require('./books');

const createErrorResponse = (h, statusCode, message) => {
  const response = h.response({
    status: 'fail',
    message,
  });
  response.code(statusCode);
  return response;
};

const addBookHandler = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  if (!name) return createErrorResponse(h, 400, 'Gagal menambahkan buku. Mohon isi nama buku');
  if (readPage > pageCount) return createErrorResponse(h, 400, 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount');

  const id = nanoid(16);
  const timestamp = new Date().toISOString();
  const finished = pageCount === readPage;
  const newBook = {
    id, name, year, author, summary, publisher, pageCount, readPage, reading, finished, insertedAt: timestamp, updatedAt: timestamp,
  };

  books.push(newBook);

  const isSuccess = books.some((book) => book.id === id);
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: { bookId: id },
    });
    response.code(201);
    return response;
  }

  return createErrorResponse(h, 500, 'Buku gagal ditambahkan');
};

const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;
  let filteredBooks = books;

  if (name) {
    const lowerCaseName = name.toLowerCase();
    filteredBooks = filteredBooks.filter((book) => book.name.toLowerCase().includes(lowerCaseName));
  }

  if (reading !== undefined) {
    filteredBooks = filteredBooks.filter((book) => book.reading === (reading === '1'));
  }

  if (finished !== undefined) {
    filteredBooks = filteredBooks.filter((book) => book.finished === (finished === '1'));
  }

  const response = h.response({
    status: 'success',
    data: {
      books: filteredBooks.map(({ id, name, publisher }) => ({ id, name, publisher })),
    },
  });
  response.code(200);
  return response;
};

const getDetailBookHandler = (request, h) => {
  const { bookId } = request.params;
  const book = books.find((b) => b.id === bookId);

  if (book) {
    const response = h.response({
      status: 'success',
      data: { book },
    });
    response.code(200);
    return response;
  }

  return createErrorResponse(h, 404, 'Buku tidak ditemukan');
};

const deleteBookHandler = (request, h) => {
  const { bookId } = request.params;
  const bookIndex = books.findIndex((b) => b.id === bookId);

  if (bookIndex !== -1) {
    books.splice(bookIndex, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  return createErrorResponse(h, 404, 'Buku gagal dihapus. Id tidak ditemukan');
};

const editBookHandler = (request, h) => {
  const { bookId } = request.params;
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  if (!name) return createErrorResponse(h, 400, 'Gagal memperbarui buku. Mohon isi nama buku');
  if (readPage > pageCount) return createErrorResponse(h, 400, 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount');

  const bookIndex = books.findIndex((b) => b.id === bookId);
  if (bookIndex !== -1) {
    const updatedAt = new Date().toISOString();
    const finished = pageCount === readPage;
    books[bookIndex] = {
      ...books[bookIndex], name, year, author, summary, publisher, pageCount, readPage, reading, finished, updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  return createErrorResponse(h, 404, 'Gagal memperbarui buku. Id tidak ditemukan');
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getDetailBookHandler,
  deleteBookHandler,
  editBookHandler,
};
