-- =====================================================================
-- RESUME ANALYZER DATABASE SCHEMA (For XAMPP MySQL / phpMyAdmin)
-- =====================================================================
-- This file contains SQL instructions to set up the necessary database tables.
-- You can import this directly into phpMyAdmin or run it via the local MySQL command line.

-- Create Database (Run this line manually if the target database does not exist)
CREATE DATABASE IF NOT EXISTS resume_analyzer DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE resume_analyzer;

-- 1. Table for Registered Users (Signups / Logins)
CREATE TABLE IF NOT EXISTS auth_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    passwordHash VARCHAR(255) NOT NULL,
    created_at VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Table for Saved Resume Analyses
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sec_token VARCHAR(100) NOT NULL,
    ip_add VARCHAR(100),
    host_name VARCHAR(255),
    dev_user VARCHAR(100),
    os_name_ver VARCHAR(255),
    latlong VARCHAR(100),
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    act_name VARCHAR(255) NOT NULL,
    act_mail VARCHAR(255) NOT NULL,
    act_mob VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    resume_score VARCHAR(50) NOT NULL,
    timestamp VARCHAR(100) NOT NULL,
    page_no VARCHAR(50) NOT NULL,
    reco_field VARCHAR(255) NOT NULL,
    cand_level VARCHAR(100) NOT NULL,
    skills TEXT NOT NULL,                -- JSON encoded array of skills
    recommended_skills TEXT NOT NULL,    -- JSON encoded array of recommendations
    courses TEXT NOT NULL,               -- JSON encoded array of courses
    pdf_name VARCHAR(255) NOT NULL,
    owner_email VARCHAR(255) NULL,       -- Email of registered user who owns this record
    INDEX idx_owner (owner_email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Table for User Reviews & Feedbacks
CREATE TABLE IF NOT EXISTS feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,
    feed_name VARCHAR(255) NOT NULL,
    feed_email VARCHAR(255) NOT NULL,
    feed_score VARCHAR(50) NOT NULL,
    comments TEXT,
    timestamp VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
