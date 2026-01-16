import { gql } from "@apollo/client"

export const GET_BOOKS = gql`
  query GetBooks {
    books {
      id
      title
      author
      isbn
      publishedDate
      createdAt
      updatedAt
    }
  }
`

export const GET_BOOK = gql`
  query GetBook($id: ID!) {
    book(id: $id) {
      id
      title
      author
      isbn
      publishedDate
      createdAt
      updatedAt
    }
  }
`

export const GET_ME = gql`
  query GetMe {
    me {
      id
      email
      name
    }
  }
`

export const CREATE_BOOK = gql`
  mutation CreateBook($title: String!, $author: String!, $isbn: String!, $publishedDate: String!) {
    createBook(title: $title, author: $author, isbn: $isbn, publishedDate: $publishedDate) {
      id
      title
      author
      isbn
      publishedDate
      createdAt
      updatedAt
    }
  }
`

export const UPDATE_BOOK = gql`
  mutation UpdateBook($id: ID!, $title: String, $author: String, $isbn: String, $publishedDate: String) {
    updateBook(id: $id, title: $title, author: $author, isbn: $isbn, publishedDate: $publishedDate) {
      id
      title
      author
      isbn
      publishedDate
      createdAt
      updatedAt
    }
  }
`

export const DELETE_BOOK = gql`
  mutation DeleteBook($id: ID!) {
    deleteBook(id: $id)
  }
`
