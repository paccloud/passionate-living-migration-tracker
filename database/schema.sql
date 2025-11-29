-- Migration Tracker Database Schema
-- Run this script in your Neon database console

-- Create milestones table
CREATE TABLE IF NOT EXISTS milestones (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'upcoming',
  completed_date VARCHAR(50),
  target_date VARCHAR(50),
  billing_status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create billing table
CREATE TABLE IF NOT EXISTS billing (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  date VARCHAR(50),
  amount INTEGER NOT NULL,
  status VARCHAR(50) DEFAULT 'upcoming',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id SERIAL PRIMARY KEY,
  author VARCHAR(100) NOT NULL,
  role VARCHAR(50) NOT NULL,
  text TEXT,
  image TEXT,
  date VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create project settings table
CREATE TABLE IF NOT EXISTS project_settings (
  id SERIAL PRIMARY KEY,
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default data
INSERT INTO milestones (title, description, status, completed_date, billing_status) VALUES
  ('Phase 1: Discovery & Planning', 'Brand analysis, requirements gathering, and project roadmap creation', 'completed', 'Nov 1', 'billed'),
  ('Phase 2: Design System & Brand Guide', 'Color palette, typography, component library, and UI documentation', 'completed', 'Nov 8', 'billed'),
  ('Phase 3: WordPress Theme Setup', 'Block theme structure, theme.json configuration, Hostinger deployment', 'completed', 'Nov 15', 'billed'),
  ('Phase 4: Header, Hero & Footer', 'Core layout components with animations and responsive design', 'completed', 'Nov 22', 'billed'),
  ('Phase 5: Episodes Plugin', 'Custom post type, video integration, and episode archive templates', 'completed', 'Nov 29', 'due'),
  ('Phase 6: Content Migration', 'Migrating existing content, media optimization, and SEO preservation', 'in-progress', NULL, 'pending'),
  ('Phase 7: Testing & QA', 'Cross-browser testing, performance optimization, accessibility audit', 'upcoming', NULL, 'pending'),
  ('Phase 8: Launch & Handoff', 'DNS migration, final deployment, training, and documentation', 'upcoming', NULL, 'pending');

UPDATE milestones SET target_date = 'Dec 6' WHERE id = 6;
UPDATE milestones SET target_date = 'Dec 13' WHERE id = 7;
UPDATE milestones SET target_date = 'Dec 20' WHERE id = 8;

INSERT INTO billing (name, date, amount, status) VALUES
  ('Phase 1-2 Deposit', 'Nov 1, 2024', 1500, 'paid'),
  ('Phase 3-4 Milestone', 'Nov 22, 2024', 1500, 'paid'),
  ('Phase 5-6 Milestone', 'Dec 6, 2024', 1500, 'pending'),
  ('Final Payment', 'Dec 20, 2024', 1500, 'upcoming');

INSERT INTO comments (author, role, text, image, date) VALUES
  ('Ryan', 'vendor', 'Initial project setup complete. Ready for design review.', NULL, 'Nov 1, 2024'),
  ('Client', 'client', 'Love the new color palette! Can we make the red a bit darker?', NULL, 'Nov 9, 2024');

INSERT INTO project_settings (key, value) VALUES
  ('current_week', '6'),
  ('target_launch', 'Dec 20'),
  ('project_title', 'Website Migration Progress'),
  ('project_subtitle', 'Tracking our journey from Avada to a custom WordPress Block Theme on Hostinger');
