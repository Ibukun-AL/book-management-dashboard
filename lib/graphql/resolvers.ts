import { getDb } from "../db"
import { getCurrentUser } from "../auth"
import type { Book } from "../db"

export const resolvers = {
  Query: {
    books: async () => {
      const user = await getCurrentUser()
      if (!user) {
        throw new Error("Not authenticated")
      }

      const db = await getDb()
      const books = db.prepare("SELECT * FROM books WHERE user_id = ? ORDER BY created_at DESC").all(user.id) as Book[]

      return books.map((book) => ({
        id: book.id,
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        publishedDate: book.published_date,
        createdAt: book.created_at,
        updatedAt: book.updated_at,
      }))
    },

    book: async (_: unknown, { id }: { id: string }) => {
      const user = await getCurrentUser()
      if (!user) {
        throw new Error("Not authenticated")
      }

      const db = await getDb()
      const book = db.prepare("SELECT * FROM books WHERE id = ? AND user_id = ?").get(id, user.id) as Book | undefined

      if (!book) {
        return null
      }

      return {
        id: book.id,
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        publishedDate: book.published_date,
        createdAt: book.created_at,
        updatedAt: book.updated_at,
      }
    },

    me: async () => {
      const user = await getCurrentUser()
      return user
    },
  },

  Mutation: {
    createBook: async (
      _: unknown,
      { title, author, isbn, publishedDate }: { title: string; author: string; isbn: string; publishedDate: string },
    ) => {
      const user = await getCurrentUser()
      if (!user) {
        throw new Error("Not authenticated")
      }

      const db = await getDb()

      // Check for duplicate ISBN
      const existing = db.prepare("SELECT id FROM books WHERE isbn = ?").get(isbn)

      if (existing) {
        throw new Error("A book with this ISBN already exists")
      }

      const result = db
        .prepare("INSERT INTO books (title, author, isbn, published_date, user_id) VALUES (?, ?, ?, ?, ?)")
        .run(title, author, isbn, publishedDate, user.id)

      const book = db.prepare("SELECT * FROM books WHERE id = ?").get(result.lastInsertRowid) as Book

      return {
        id: book.id,
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        publishedDate: book.published_date,
        createdAt: book.created_at,
        updatedAt: book.updated_at,
      }
    },

    updateBook: async (
      _: unknown,
      {
        id,
        title,
        author,
        isbn,
        publishedDate,
      }: { id: string; title?: string; author?: string; isbn?: string; publishedDate?: string },
    ) => {
      const user = await getCurrentUser()
      if (!user) {
        throw new Error("Not authenticated")
      }

      const db = await getDb()

      // Check if book exists and belongs to user
      const book = db.prepare("SELECT * FROM books WHERE id = ? AND user_id = ?").get(id, user.id) as Book | undefined

      if (!book) {
        throw new Error("Book not found")
      }

      // Check for duplicate ISBN if changing
      if (isbn && isbn !== book.isbn) {
        const existing = db.prepare("SELECT id FROM books WHERE isbn = ? AND id != ?").get(isbn, id)

        if (existing) {
          throw new Error("A book with this ISBN already exists")
        }
      }

      // Update book
      const updates = []
      const values = []

      if (title !== undefined) {
        updates.push("title = ?")
        values.push(title)
      }
      if (author !== undefined) {
        updates.push("author = ?")
        values.push(author)
      }
      if (isbn !== undefined) {
        updates.push("isbn = ?")
        values.push(isbn)
      }
      if (publishedDate !== undefined) {
        updates.push("published_date = ?")
        values.push(publishedDate)
      }

      updates.push("updated_at = CURRENT_TIMESTAMP")
      values.push(id, user.id)

      db.prepare(`UPDATE books SET ${updates.join(", ")} WHERE id = ? AND user_id = ?`).run(...values)

      const updatedBook = db.prepare("SELECT * FROM books WHERE id = ?").get(id) as Book

      return {
        id: updatedBook.id,
        title: updatedBook.title,
        author: updatedBook.author,
        isbn: updatedBook.isbn,
        publishedDate: updatedBook.published_date,
        createdAt: updatedBook.created_at,
        updatedAt: updatedBook.updated_at,
      }
    },

    deleteBook: async (_: unknown, { id }: { id: string }) => {
      const user = await getCurrentUser()
      if (!user) {
        throw new Error("Not authenticated")
      }

      const db = await getDb()

      const result = db.prepare("DELETE FROM books WHERE id = ? AND user_id = ?").run(id, user.id)

      return result.changes > 0
    },
  },
}
