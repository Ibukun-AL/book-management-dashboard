import { BooksList } from "@/components/books-list"
import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut, BookOpen } from "lucide-react"

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Book Manager</h1>
              <p className="text-sm text-muted-foreground">Welcome, {user.name || user.email}</p>
            </div>
          </div>
          <form action="/auth/logout" method="POST">
            <Button variant="outline" type="submit">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </form>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <BooksList />
      </main>
    </div>
  )
}
