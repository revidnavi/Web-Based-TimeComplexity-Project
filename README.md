# Web-Based-TimeComplexity-Project

## Database Schema

```sql
CREATE DATABASE aco_db;
USE aco_db;

CREATE TABLE signup_codes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(32) UNIQUE,
    code INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(32) UNIQUE,
    hashed_pass VARCHAR(255),
    activated BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    
    algo VARCHAR(32),
    input_size INT,

    execution_time FLOAT,
    space_usage BIGINT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```