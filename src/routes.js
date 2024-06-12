/* eslint-disable linebreak-style */

const {
  addBookHandler, getAllBooksHandler, getDetailBookHandler, deleteBookHandler,
  editBookHandler,
} = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: addBookHandler,
  },
  {
    method: 'GET',
    path: '/books',
    handler: getAllBooksHandler,
  },
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: getDetailBookHandler,
  },
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: deleteBookHandler,
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: editBookHandler,
  },
];

module.exports = routes;
