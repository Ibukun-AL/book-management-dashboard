import Database from "better-sqlite3"
import { join } from "path"
import { existsSync, mkdirSync } from "fs"
import bcrypt from "bcryptjs"

let db: Database.Database | null = null

export async function getDb() {
  if (!db) {
    const isVercel = process.env.VERCEL === "1"
    const dataDir = isVercel ? "/tmp" : join(process.cwd(), "data")

    if (!existsSync(dataDir)) {
      mkdirSync(dataDir, { recursive: true })
    }

    const dbPath = join(dataDir, "books.db")

    if (isVercel) {
      console.log("[v0] WARNING: Running on Vercel with ephemeral /tmp storage. Data will be lost between deployments!")
      console.log("[v0] For production, please migrate to Vercel Postgres, Neon, or Supabase")
    }

    db = new Database(dbPath)
    db.pragma("journal_mode = WAL")

    await initializeTables(db)
  }
  return db
}

async function initializeTables(db: Database.Database) {
  db.exec(`
    -- Create users table for authentication
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      name TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Create books table
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

    -- Create index on user_id for faster queries
    CREATE INDEX IF NOT EXISTS idx_books_user_id ON books(user_id);
  `)

  const existingUser = db.prepare("SELECT id FROM users WHERE email = ?").get("test@example.com")

  if (!existingUser) {
    const passwordHash = bcrypt.hashSync("password123", 10)
    console.log("[v0] Creating demo user with hash length:", passwordHash.length)

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

    console.log("[v0] Demo user and sample books created")
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
