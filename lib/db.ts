import { existsSync, mkdirSync } from "fs"
import { join } from "path"
import bcrypt from "bcryptjs"

// In-memory storage for Vercel (where better-sqlite3 doesn't work)
const inMemoryStore = {
  users: [] as User[],
  books: [] as Book[],
  initialized: false,
}

let db: any = null
let useInMemory = false

export async function getDb() {
  if (!db && !useInMemory) {
    const isVercel = process.env.VERCEL === "1"

    // Try to use SQLite for local development
    if (!isVercel) {
      try {
        const Database = (await import("better-sqlite3")).default
        const dataDir = join(process.cwd(), "data")

        if (!existsSync(dataDir)) {
          mkdirSync(dataDir, { recursive: true })
        }

        const dbPath = join(dataDir, "books.db")
        db = new Database(dbPath)
        db.pragma("journal_mode = WAL")

        await initializeSQLiteTables(db)
        console.log("[v0] Using SQLite database for local development")
        return db
      } catch (error) {
        console.log("[v0] SQLite failed, falling back to in-memory storage:", error)
        useInMemory = true
      }
    } else {
      console.log("[v0] Running on Vercel - using in-memory storage")
      console.log("[v0] WARNING: Data will be lost between requests!")
      console.log("[v0] For production, please migrate to Vercel Postgres, Neon, or Supabase")
      useInMemory = true
    }
  }

  if (useInMemory) {
    await initializeInMemoryStore()
    return createInMemoryDb()
  }

  return db
}

async function initializeSQLiteTables(db: any) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      name TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      isbn TEXT NOT NULL UNIQUE,
      published_date TEXT NOT NULL,
      user_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_books_user_id ON books(user_id);
  `)

  const existingUser = db.prepare("SELECT id FROM users WHERE email = ?").get("test@example.com")

  if (!existingUser) {
    const passwordHash = bcrypt.hashSync("password123", 10)
    db.prepare("INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)").run(
      "test@example.com",
      passwordHash,
      "Test User",
    )

    const userId = db.prepare("SELECT id FROM users WHERE email = ?").get("test@example.com") as { id: number }

    db.prepare(`
      INSERT INTO books (title, author, isbn, published_date, user_id) VALUES
        ('The Great Gatsby', 'F. Scott Fitzgerald', '978-0-7432-7356-5', '1925-04-10', ?),
        ('To Kill a Mockingbird', 'Harper Lee', '978-0-06-112008-4', '1960-07-11', ?),
        ('1984', 'George Orwell', '978-0-452-28423-4', '1949-06-08', ?)
    `).run(userId.id, userId.id, userId.id)
  }
}

async function initializeInMemoryStore() {
  if (inMemoryStore.initialized) return

  const passwordHash = bcrypt.hashSync("password123", 10)
  const testUser: User = {
    id: 1,
    email: "test@example.com",
    password_hash: passwordHash,
    name: "Test User",
    created_at: new Date().toISOString(),
  }

  inMemoryStore.users.push(testUser)

  const sampleBooks: Book[] = [
    {
      id: 1,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      isbn: "978-0-7432-7356-5",
      published_date: "1925-04-10",
      user_id: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 2,
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      isbn: "978-0-06-112008-4",
      published_date: "1960-07-11",
      user_id: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 3,
      title: "1984",
      author: "George Orwell",
      isbn: "978-0-452-28423-4",
      published_date: "1949-06-08",
      user_id: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ]

  inMemoryStore.books.push(...sampleBooks)
  inMemoryStore.initialized = true
}

function createInMemoryDb() {
  return {
    prepare: (sql: string) => {
      return {
        get: (...params: any[]) => {
          if (sql.includes("SELECT * FROM users WHERE email = ?")) {
            return inMemoryStore.users.find((u) => u.email === params[0])
          }
          if (sql.includes("SELECT * FROM users WHERE id = ?")) {
            return inMemoryStore.users.find((u) => u.id === params[0])
          }
          if (sql.includes("SELECT * FROM books WHERE id = ?")) {
            return inMemoryStore.books.find((b) => b.id === params[0])
          }
          return undefined
        },
        all: (...params: any[]) => {
          if (sql.includes("SELECT * FROM books WHERE user_id = ?")) {
            return inMemoryStore.books.filter((b) => b.user_id === params[0])
          }
          if (sql.includes("SELECT * FROM books")) {
            return inMemoryStore.books
          }
          return []
        },
        run: (...params: any[]) => {
          if (sql.includes("INSERT INTO books")) {
            const newId = Math.max(0, ...inMemoryStore.books.map((b) => b.id)) + 1
            const book: Book = {
              id: newId,
              title: params[0],
              author: params[1],
              isbn: params[2],
              published_date: params[3],
              user_id: params[4],
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }
            inMemoryStore.books.push(book)
            return { lastInsertRowid: newId, changes: 1 }
          }
          if (sql.includes("UPDATE books")) {
            const bookId = params[4]
            const index = inMemoryStore.books.findIndex((b) => b.id === bookId)
            if (index !== -1) {
              inMemoryStore.books[index] = {
                ...inMemoryStore.books[index],
                title: params[0],
                author: params[1],
                isbn: params[2],
                published_date: params[3],
                updated_at: new Date().toISOString(),
              }
              return { changes: 1 }
            }
            return { changes: 0 }
          }
          if (sql.includes("DELETE FROM books WHERE id = ?")) {
            const initialLength = inMemoryStore.books.length
            inMemoryStore.books = inMemoryStore.books.filter((b) => b.id !== params[0])
            return { changes: initialLength - inMemoryStore.books.length }
          }
          return { changes: 0 }
        },
      }
    },
  }
}

export interface User {
  id: number
  email: string
  password_hash: string
  name: string | null
  created_at: string
}

export interface Book {
  id: number
  title: string
  author: string
  isbn: string
  published_date: string
  user_id: number
  created_at: string
  updated_at: string
}
