import sqlite3
import os
from pathlib import Path

# Create data directory if it doesn't exist
data_dir = Path('data')
data_dir.mkdir(exist_ok=True)

# Create database
db_path = data_dir / 'books.db'

print(f"Setting up database at {db_path}")

# Read and execute SQL scripts
scripts_dir = Path('scripts')

# Execute setup script
with open(scripts_dir / '01-setup-database.sql', 'r') as f:
    setup_sql = f.read()

with open(scripts_dir / '02-seed-data.sql', 'r') as f:
    seed_sql = f.read()

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

print("Creating tables...")
cursor.executescript(setup_sql)

print("Seeding data...")
cursor.executescript(seed_sql)

conn.commit()
conn.close()

print("Database setup complete!")
