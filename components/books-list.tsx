"use client"

import { useState } from "react"
import { useMutation, useQuery } from "@apollo/client"
import { BookCard } from "./book-card"
import { BookFormDialog } from "./book-form-dialog"
import { Button } from "@/components/ui/button"
import { Plus, Loader2, BookOpen } from "lucide-react"
import { GET_BOOKS, CREATE_BOOK, UPDATE_BOOK, DELETE_BOOK } from "@/lib/graphql/queries"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Book {
  id: string
  title: string
  author: string
  isbn: string
  publishedDate: string
  createdAt: string
  updatedAt: string
}

export function BooksList() {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingBook, setEditingBook] = useState<Book | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const { data, loading, refetch } = useQuery(GET_BOOKS)
  const [createBook] = useMutation(CREATE_BOOK)
  const [updateBook] = useMutation(UPDATE_BOOK)
  const [deleteBook] = useMutation(DELETE_BOOK)

  const handleCreate = async (formData: any) => {
    try {
      await createBook({
        variables: formData,
      })
      toast.success("Book created successfully")
      refetch()
    } catch (error: any) {
      toast.error(error.message || "Failed to create book")
    }
  }

  const handleUpdate = async (formData: any) => {
    if (!editingBook) return

    try {
      await updateBook({
        variables: {
          id: editingBook.id,
          ...formData,
        },
      })
      toast.success("Book updated successfully")
      setEditingBook(null)
      refetch()
    } catch (error: any) {
      toast.error(error.message || "Failed to update book")
    }
  }

  const handleDelete = async () => {
    if (!deletingId) return

    try {
      await deleteBook({
        variables: { id: deletingId },
      })
      toast.success("Book deleted successfully")
      setDeletingId(null)
      refetch()
    } catch (error: any) {
      toast.error(error.message || "Failed to delete book")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const books: Book[] = data?.books || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-balance">Your Books</h2>
          <p className="text-muted-foreground">Manage your personal library</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Book
        </Button>
      </div>

      {books.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-lg border-2 border-dashed">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No books yet</h3>
          <p className="text-muted-foreground mb-4">Get started by adding your first book</p>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Book
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <BookCard key={book.id} book={book} onEdit={setEditingBook} onDelete={setDeletingId} />
          ))}
        </div>
      )}

      <BookFormDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSubmit={handleCreate}
        title="Add New Book"
        description="Fill in the details to add a new book to your library"
      />

      <BookFormDialog
        open={!!editingBook}
        onOpenChange={(open) => !open && setEditingBook(null)}
        onSubmit={handleUpdate}
        initialData={
          editingBook
            ? {
                title: editingBook.title,
                author: editingBook.author,
                isbn: editingBook.isbn,
                publishedDate: editingBook.publishedDate,
              }
            : undefined
        }
        title="Edit Book"
        description="Update the book details"
      />

      <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the book from your library.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
