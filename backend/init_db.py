import sqlite3

conn = sqlite3.connect("pet_adoption.db")
cursor = conn.cursor()

# Create users table
cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        password TEXT NOT NULL,
        is_admin INTEGER DEFAULT 0
    )
''')

# Create pets table
cursor.execute('''
    CREATE TABLE IF NOT EXISTS pets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        breed TEXT,
        age INTEGER,
        adopted BOOLEAN DEFAULT 0,
        image_path TEXT
    )
''')

# Create adoptions table
cursor.execute('''
    CREATE TABLE IF NOT EXISTS adoptions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        pet_id INTEGER NOT NULL,
        adopted_on TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (pet_id) REFERENCES pets(id)
    )
''')

# Questionnaire table
cursor.execute('''
    CREATE TABLE IF NOT EXISTS questionnaires (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        answers TEXT NOT NULL,
        approved BOOLEAN DEFAULT 0,
        interested_pet_id INTEGER,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (interested_pet_id) REFERENCES pets(id)
    )
''')

# Optional admin account
cursor.execute("SELECT * FROM users WHERE username = 'admin'")
if not cursor.fetchone():
    cursor.execute('''
        INSERT INTO users (username, password, is_admin)
        VALUES ('admin', 'admin123', 1)
    ''')

conn.commit()
conn.close()
print("Database initialized successfully.")
