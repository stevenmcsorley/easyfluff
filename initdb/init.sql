-- initdb/init.sql

-- =============================
-- 1. Users Table
-- =============================
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,           -- 'customer' or 'driver'
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================
-- 2. Subscription Plans
-- =============================
CREATE TABLE IF NOT EXISTS subscriptions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,          -- e.g., 'Basic', 'Standard', 'Family'
  description TEXT,
  price NUMERIC(10,2) NOT NULL,        -- Price per billing period
  frequency VARCHAR(50) NOT NULL,      -- e.g., 'weekly', 'monthly'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================
-- 3. Customer Subscriptions
-- =============================
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subscription_id INTEGER NOT NULL REFERENCES subscriptions(id),
  start_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  next_billing TIMESTAMP WITH TIME ZONE,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id)  -- one active subscription per customer at a time
);

-- =============================
-- 4. Laundrettes Table
-- =============================
CREATE TABLE IF NOT EXISTS laundrettes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT,
  phone VARCHAR(50),
  email VARCHAR(255),
  rating NUMERIC(3,2) DEFAULT 0.0,
  pricing_details JSONB,               -- Optional: store pricing as JSON (can be extended later)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================
-- 5. Orders Table
-- =============================
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,  -- Customer
  driver_id INTEGER REFERENCES users(id) ON DELETE SET NULL,         -- Assigned driver (role = driver)
  laundrette_id INTEGER REFERENCES laundrettes(id) ON DELETE SET NULL, -- Selected laundrette
  subscription_id INTEGER REFERENCES user_subscriptions(id) ON DELETE SET NULL, -- Optional: If order is part of a subscription
  status VARCHAR(50) NOT NULL DEFAULT 'Scheduled',  -- e.g., 'Scheduled', 'In Process', 'Delivered', 'Cancelled'
  scheduled_pickup TIMESTAMP WITH TIME ZONE,
  actual_pickup TIMESTAMP WITH TIME ZONE,
  scheduled_delivery TIMESTAMP WITH TIME ZONE,
  actual_delivery TIMESTAMP WITH TIME ZONE,
  order_total NUMERIC(10,2),
  pickup_address TEXT,
  delivery_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================
-- 6. Payments Table
-- =============================
CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,  -- Customer who paid
  amount NUMERIC(10,2) NOT NULL,
  payment_method VARCHAR(50),    -- e.g., 'card', 'paypal'
  status VARCHAR(50) NOT NULL,     -- e.g., 'Successful', 'Pending', 'Failed'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================
-- 7. Driver Ratings Table
-- =============================
CREATE TABLE IF NOT EXISTS driver_ratings (
  id SERIAL PRIMARY KEY,
  driver_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5) NOT NULL,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
