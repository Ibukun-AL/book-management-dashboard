"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

const bookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  isbn: z.string().min(10, "ISBN must be at least 10 characters"),
  publishedDate: z.string().min(1, "Published date is required"),
})

type BookFormData = z.infer<typeof bookSchema>

interface BookFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: BookFormData) => Promise<void>
  initialData?: BookFormData
  title: string
  description: string
}

export function BookFormDialog({ open, onOpenChange, onSubmit, initialData, title, description }: BookFormDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
    defaultValues: initialData,
  })

  const handleFormSubmit = async (data: BookFormData) => {
    await onSubmit(data)
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...register("title")} placeholder="Enter book title" />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="author">Author</Label>
            <Input id="author" {...register("author")} placeholder="Enter author name" />
            {errors.author && <p className="text-sm text-destructive">{errors.author.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="isbn">ISBN</Label>
            <Input id="isbn" {...register("isbn")} placeholder="978-0-123456-78-9" />
            {errors.isbn && <p className="text-sm text-destructive">{errors.isbn.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="publishedDate">Published Date</Label>
            <Input id="publishedDate" type="date" {...register("publishedDate")} />
            {errors.publishedDate && <p className="text-sm text-destructive">{errors.publishedDate.message}</p>}
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? "Saving..." : "Save Book"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
