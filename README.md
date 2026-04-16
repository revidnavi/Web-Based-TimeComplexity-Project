# Setup Guide

## .gitignore files

### 1. config/backend.php:

```php
<?php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'aco_db');
define('PROJECT_NAME', 'AlgoSpark');
define('PROJECT_EMAIL', 'algospark67@gmail.com');
define('EMAIL_PASS', '');
?>
```

## Database Schema

```sql
CREATE DATABASE aco_db;
USE aco_db;

CREATE TABLE signup_codes (
    id INT AUTO_INCREMENT PRIMARY KEY,

    email VARCHAR(32),
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

CREATE TABLE algorithms (
    id INT PRIMARY KEY AUTO_INCREMENT,

    algo_name VARCHAR(32),
    category VARCHAR(16),

    time_best VARCHAR(16),
    time_avg VARCHAR(16),
    time_worst VARCHAR(16),
    space_complexity VARCHAR(16),

    active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    algo_id INT,

    input_size INT,
    execution_time FLOAT,
    space_usage BIGINT,

    archived BOOLEAN DEFAUlT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (algo_id) REFERENCES algorithms(id)
);
```

## Sample Data

```sql
INSERT INTO algorithms 
(name, category, time_best, time_avg, time_worst, space_complexity)
VALUES
('Bubble Sort', 'Sorting', 'O(n)', 'O(n^2)', 'O(n^2)', 'O(1)'),
('Merge Sort', 'Sorting', 'O(n log n)', 'O(n log n)', 'O(n log n)', 'O(n)'),
('Binary Search', 'Searching', 'O(1)', 'O(log n)', 'O(log n)', 'O(1)'),
('Linear Search', 'Searching', 'O(1)', 'O(n)', 'O(n)', 'O(1)'),
('Recursive Fibonacci', 'Computation', 'O(1)', 'O(2^n)', 'O(2^n)', 'O(n)'),
('Dynamic Fibonacci', 'Computation', 'O(n)', 'O(n)', 'O(n)', 'O(n)');
```