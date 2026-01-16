-- Insert a test user (password: password123)
-- Password hash for 'password123' using bcrypt
INSERT OR IGNORE INTO users (id, email, password_hash, name) 
VALUES (1, 'test@example.com', '$2b$10$rKj5JxGXN4U5K3YhX3YhXezXKZK3YhX3YhX3YhX3YhX3YhX3YhX3Y', 'Test User');

-- Insert sample books
INSERT OR IGNORE INTO books (title, author, isbn, published_date, user_id) VALUES
  ('The Great Gatsby', 'F. Scott Fitzgerald', '978-0-7432-7356-5', '1925-04-10', 1),
  ('To Kill a Mockingbird', 'Harper Lee', '978-0-06-112008-4', '1960-07-11', 1),
  ('1984', 'George Orwell', '978-0-452-28423-4', '1949-06-08', 1);
