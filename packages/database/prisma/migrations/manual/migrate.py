# Manual migration script for appointments table
import os
import psycopg2
from dotenv import load_dotenv

def run_migration():
    load_dotenv()
    
    # Get database connection info from environment variables
    database_url = os.getenv('DATABASE_URL')
    
    if not database_url:
        raise ValueError("DATABASE_URL environment variable is not set")
    
    try:
        # Connect to database
        conn = psycopg2.connect(database_url)
        conn.autocommit = False
        cursor = conn.cursor()
        
        try:
            # Read the SQL file
            with open('20250819_add_appointments.sql', 'r') as f:
                sql = f.read()
            
            # Execute the SQL
            cursor.execute(sql)
            
            # Commit the transaction
            conn.commit()
            print("Migration completed successfully")
            
        except Exception as e:
            conn.rollback()
            print(f"Error executing migration: {str(e)}")
            raise
        
        finally:
            cursor.close()
            
    except Exception as e:
        print(f"Error connecting to database: {str(e)}")
        raise
        
    finally:
        if 'conn' in locals():
            conn.close()

if __name__ == "__main__":
    run_migration()
