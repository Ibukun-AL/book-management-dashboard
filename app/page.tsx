import { Button } from "@/components/ui/button"
import { BookOpen, ArrowRight, Check } from "lucide-react"
import Link from "next/link"
import { auth0 } from "@/lib/auth0"

export default async function HomePage() {
  const session = await auth0.getSession()
  const user = session?.user

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Book Manager</span>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="text-sm text-muted-foreground">Welcome, {user.name || user.email}</span>
                <Button asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <Button variant="ghost" asChild>
                  <a href="/auth/logout">Logout</a>
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <a href="/auth/login">Login</a>
                </Button>
                <Button asChild>
                  <a href="/auth/login">Get Started</a>
                </Button>
              </>
            )}
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            Full-Stack Book Management
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-balance leading-tight">
            Organize Your Personal Library with Ease
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance leading-relaxed">
            A modern book management system built with Next.js, GraphQL, SQLite, and Auth0. Keep track of your reading
            collection in one place.
          </p>

          <div className="flex items-center justify-center gap-4 pt-4">
            <Button size="lg" asChild>
              {user ? (
                <Link href="/dashboard">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              ) : (
                <a href="/api/auth/login">
                  Start Managing Books
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              )}
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6 pt-16">
            {[
              {
                title: "GraphQL API",
                description: "Type-safe API with Apollo Server for efficient data fetching",
              },
              {
                title: "Auth0 Authentication",
                description: "Enterprise-grade authentication with Auth0 integration",
              },
              {
                title: "SQLite Database",
                description: "Lightweight and fast database for book storage",
              },
            ].map((feature, i) => (
              <div key={i} className="bg-card border rounded-lg p-6 text-left">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Check className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
