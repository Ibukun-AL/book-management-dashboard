export const typeDefs = `
  type User {
    id: ID!
    email: String!
    name: String
  }

  type Book {
    id: ID!
    title: String!
    author: String!
    isbn: String!
    publishedDate: String!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    books: [Book!]!
    book(id: ID!): Book
    me: User
  }

  type Mutation {
    createBook(title: String!, author: String!, isbn: String!, publishedDate: String!): Book!
    updateBook(id: ID!, title: String, author: String, isbn: String, publishedDate: String): Book!
    deleteBook(id: ID!): Boolean!
  }
`
