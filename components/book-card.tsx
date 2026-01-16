"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Calendar, Edit, Trash2 } from "lucide-react"
import { format } from "date-fns"

interface Book {
  id: string
  title: string
  author: string
  isbn: string
  publishedDate: string
  createdAt: string
  updatedAt: string
}

interface BookCardProps {
  book: Book
  onEdit: (book: Book) => void
  onDelete: (id: string) => void
}

export function BookCard({ book, onEdit, onDelete }: BookCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-start gap-2 text-pretty">
          <BookOpen className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <span className="leading-relaxed">{book.title}</span>
        </CardTitle>
        <CardDescription className="text-base">by {book.author}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Published: {format(new Date(book.publishedDate), "MMM d, yyyy")}</span>
        </div>
        <div className="text-sm text-muted-foreground">
          <span className="font-medium">ISBN:</span> {book.isbn}
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => onEdit(book)} className="flex-1">
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
        <Button variant="destructive" size="sm" onClick={() => onDelete(book.id)} className="flex-1">
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  )
}
