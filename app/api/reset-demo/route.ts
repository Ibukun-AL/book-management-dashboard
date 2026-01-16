import { NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function POST() {
  try {
    const db = await getDb()

    // Hash the password synchronously to ensure it's correct
    const passwordHash = bcrypt.hashSync("password123", 10)

    console.log(" Resetting demo user password...")
    console.log(" New hash length:", passwordHash.length)
    console.log(" New hash (first 20 chars):", passwordHash.substring(0, 20))

    // Update the demo user's password
    const result = db
      .prepare("UPDATE users SET password_hash = ? WHERE email = ?")
      .run(passwordHash, "test@example.com")

    console.log(" Updated rows:", result.changes)

    // Verify it was stored correctly
    const user = db.prepare("SELECT password_hash FROM users WHERE email = ?").get("test@example.com") as
      | { password_hash: string }
      | undefined

    if (user) {
      console.log(" Stored hash length:", user.password_hash.length)
      console.log(" Stored hash (first 20 chars):", user.password_hash.substring(0, 20))

      // Test the password immediately
      const testResult = bcrypt.compareSync("password123", user.password_hash)
      console.log(" Test comparison result:", testResult)
    }

    return NextResponse.json({
      success: true,
      message: "Demo user password reset to 'password123'",
      changes: result.changes,
    })
  } catch (error) {
    console.error(" Error resetting password:", error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
