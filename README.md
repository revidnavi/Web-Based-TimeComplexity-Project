# Setup Guide
## .gitignore files
### "backend.php" in the "config" folder, do not forget to configure them:
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