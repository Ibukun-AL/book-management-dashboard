import { getDb } from "./db"
import { auth0 } from "./auth0"

export async function getCurrentUser() {
  const session = await auth0.getSession()

  if (!session?.user) {
    return null
  }

  const db = await getDb()

  // Get or create user in local database based on Auth0 user
  const auth0User = session.user

  if (!auth0User.email) {
    return null
  }

  let user = db.prepare("SELECT id, email, name FROM users WHERE email = ?").get(auth0User.email) as
    | { id: number; email: string; name: string | null }
    | undefined

  // If user doesn't exist in our database, create them
  if (!user) {
    const result = db
      .prepare("INSERT INTO users (email, name, password_hash) VALUES (?, ?, ?)")
      .run(auth0User.email, auth0User.name || null, "auth0")

    user = {
      id: result.lastInsertRowid as number,
      email: auth0User.email,
      name: auth0User.name || null,
    }
  }

  return user
}
