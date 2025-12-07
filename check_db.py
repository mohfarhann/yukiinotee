import sqlite3

conn = sqlite3.connect(r'c:\Users\HP\Documents\projects\yukinote\yukinote\cc-cedict.sqlite')
cursor = conn.cursor()

# Get table names
cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
tables = [row[0] for row in cursor.fetchall()]
print("Tables:", tables)

# Get schema for first table
if tables:
    cursor.execute(f"PRAGMA table_info({tables[0]})")
    schema = cursor.fetchall()
    print(f"\nSchema for {tables[0]}:")
    for col in schema:
        print(f"  {col[1]}: {col[2]}")
    
    # Sample data
    cursor.execute(f"SELECT * FROM {tables[0]} LIMIT 1")
    sample = cursor.fetchone()
    print(f"\nSample row: {sample}")

conn.close()
