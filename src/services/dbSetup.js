import { supabase } from './supabase';

export const initializeDatabase = async () => {
  try {
    // Create trainers table
    await supabase.rpc('exec', {
      query: `
        CREATE TABLE IF NOT EXISTS trainers (
          id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
          name TEXT NOT NULL,
          photo_url TEXT,
          certifications TEXT,
          experience_years INT,
          specialization TEXT,
          bio TEXT,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `
    }).then(r => console.log('Trainers table created/checked'));
  } catch (error) {
    console.log('Table setup - will be created manually if needed');
  }
};

export const createTableSQL = {
  trainers: `
    CREATE TABLE IF NOT EXISTS trainers (
      id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      name TEXT NOT NULL,
      photo_url TEXT,
      certifications TEXT,
      experience_years INT,
      specialization TEXT,
      bio TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `,
  testimonials: `
    CREATE TABLE IF NOT EXISTS testimonials (
      id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      client_name TEXT NOT NULL,
      message TEXT NOT NULL,
      rating INT,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `,
  faqs: `
    CREATE TABLE IF NOT EXISTS faqs (
      id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `,
  gym_info: `
    CREATE TABLE IF NOT EXISTS gym_info (
      id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      name TEXT DEFAULT 'ALBO FITNESS',
      address TEXT,
      phone TEXT,
      email TEXT,
      hours TEXT,
      about TEXT,
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `,
  enquiries: `
    CREATE TABLE IF NOT EXISTS enquiries (
      id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      age INT,
      gender TEXT,
      goal_physique TEXT,
      height DECIMAL(5,2),
      weight DECIMAL(6,2),
      preferred_trainer TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `
};
