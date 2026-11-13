CREATE TABLE IF NOT EXISTS services (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price_cents INTEGER NOT NULL DEFAULT 0,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  active INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
  review_text TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','approved','hidden')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_reviews_status_created ON reviews(status,created_at DESC);
CREATE TABLE IF NOT EXISTS customers (id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT NOT NULL,email TEXT NOT NULL DEFAULT '',phone TEXT NOT NULL DEFAULT '',notes TEXT NOT NULL DEFAULT '',created_at TEXT NOT NULL DEFAULT (datetime('now')));
CREATE TABLE IF NOT EXISTS appointments (id INTEGER PRIMARY KEY AUTOINCREMENT,customer_name TEXT NOT NULL,customer_email TEXT NOT NULL DEFAULT '',customer_phone TEXT NOT NULL DEFAULT '',service_name TEXT NOT NULL DEFAULT '',appointment_at TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'requested',notes TEXT NOT NULL DEFAULT '',created_at TEXT NOT NULL DEFAULT (datetime('now')));
CREATE TABLE IF NOT EXISTS invoices (id INTEGER PRIMARY KEY AUTOINCREMENT,invoice_number TEXT NOT NULL UNIQUE,customer_name TEXT NOT NULL,customer_email TEXT NOT NULL DEFAULT '',description TEXT NOT NULL DEFAULT '',amount_cents INTEGER NOT NULL DEFAULT 0,status TEXT NOT NULL DEFAULT 'draft',due_date TEXT NOT NULL DEFAULT '',created_at TEXT NOT NULL DEFAULT (datetime('now')));
CREATE TABLE IF NOT EXISTS service_addons (id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT NOT NULL,description TEXT NOT NULL DEFAULT '',price_cents INTEGER NOT NULL DEFAULT 0,duration_minutes INTEGER NOT NULL DEFAULT 0,active INTEGER NOT NULL DEFAULT 1);
CREATE TABLE IF NOT EXISTS site_settings (setting_key TEXT PRIMARY KEY,setting_value TEXT NOT NULL DEFAULT '');
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_at);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);

CREATE TABLE IF NOT EXISTS callback_requests (id INTEGER PRIMARY KEY AUTOINCREMENT,customer_name TEXT NOT NULL,customer_phone TEXT NOT NULL,customer_email TEXT NOT NULL DEFAULT '',message TEXT NOT NULL DEFAULT '',status TEXT NOT NULL DEFAULT 'new' CHECK(status IN ('new','contacted','closed')),created_at TEXT NOT NULL DEFAULT (datetime('now')));
CREATE INDEX IF NOT EXISTS idx_callback_requests_status_created ON callback_requests(status,created_at DESC);
