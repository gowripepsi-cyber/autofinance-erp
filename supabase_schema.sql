-- 1. Create CUSTOMERS Table
CREATE TABLE IF NOT EXISTS customers (
    id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    father_name TEXT,
    phone_number TEXT,
    id_number TEXT,
    gender TEXT,
    address TEXT,
    city TEXT,
    pincode TEXT,
    occupation TEXT,
    introducer_name TEXT,
    avatar TEXT,
    pan_uploaded BOOLEAN DEFAULT FALSE,
    utility_bill_uploaded BOOLEAN DEFAULT FALSE,
    crif_score INTEGER,
    category TEXT CHECK (category IN ('Prime / Low Risk', 'Medium Risk', 'High Risk')),
    probability TEXT,
    registration_date DATE DEFAULT CURRENT_DATE,
    status TEXT CHECK (status IN ('Completed', 'In Progress'))
);

-- 2. Create VEHICLES Table
CREATE TABLE IF NOT EXISTS vehicles (
    id TEXT PRIMARY KEY,
    make TEXT NOT NULL,
    model TEXT NOT NULL,
    year INTEGER NOT NULL,
    registration_no TEXT UNIQUE,
    vin TEXT UNIQUE,
    engine_no TEXT,
    fuel_type TEXT CHECK (fuel_type IN ('Petrol', 'Diesel', 'Electric (EV)', 'Hybrid')),
    purchase_price NUMERIC(12, 2) NOT NULL,
    sale_price NUMERIC(12, 2) NOT NULL,
    purchase_date DATE,
    funding_account TEXT,
    seller_details TEXT,
    rc_received BOOLEAN DEFAULT FALSE,
    active_insurance BOOLEAN DEFAULT FALSE,
    image TEXT,
    status TEXT CHECK (status IN ('Completed', 'In Transit'))
);

-- 3. Create LOANS Table
CREATE TABLE IF NOT EXISTS loans (
    id TEXT PRIMARY KEY,
    customer_id TEXT REFERENCES customers(id) ON DELETE SET NULL,
    customer_name TEXT,
    vehicle_id TEXT REFERENCES vehicles(id) ON DELETE SET NULL,
    vehicle_name TEXT,
    sale_price NUMERIC(12, 2) NOT NULL,
    down_payment NUMERIC(12, 2) NOT NULL,
    loan_amount NUMERIC(12, 2) NOT NULL,
    tenure_months INTEGER NOT NULL,
    interest_rate NUMERIC(5, 2) NOT NULL,
    doc_fee NUMERIC(10, 2) DEFAULT 0,
    due_start_date DATE,
    emi_calculated NUMERIC(12, 2) NOT NULL,
    status TEXT CHECK (status IN ('Draft', 'Documents', 'Review', 'Approved', 'Active')),
    credit_score INTEGER,
    risk_category TEXT,
    default_instances INTEGER DEFAULT 0,
    employment_length TEXT,
    dti_ratio TEXT
);

-- 4. Create TRANSACTIONS Table
CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    customer TEXT,
    vehicle TEXT,
    amount NUMERIC(12, 2) NOT NULL,
    status TEXT CHECK (status IN ('Success', 'Failed', 'Pending')),
    date DATE DEFAULT CURRENT_DATE
);

-- 5. Create USERS Table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL, -- Plaintext for simplicity. Hash in production environments.
    full_name TEXT NOT NULL,
    business_name TEXT,
    address TEXT,
    mobile_number TEXT,
    role TEXT CHECK (role IN ('admin', 'user', 'demo')) NULL, -- Nullable!
    status TEXT CHECK (status IN ('Pending', 'Approved', 'Suspended')) DEFAULT 'Pending'
);

-- 6. Seed Initial Data
INSERT INTO vehicles (id, make, model, year, registration_no, vin, engine_no, fuel_type, purchase_price, sale_price, purchase_date, funding_account, seller_details, rc_received, active_insurance, image, status) VALUES
('VEH-001', 'BMW', 'M4 Competition', 2023, 'WBS-4Z9C0', 'WBS4Z9C0X823145', 'S58-B30A', 'Petrol', 72400.00, 82000.00, '2023-10-24', 'Secondary Reserve (...1102)', 'Munich Premium Autos', true, true, 'https://lh3.googleusercontent.com/aida-public/AB6AXuBaTwRYF4nGGvEyKAXeQ2TJxh85EwhuOYeA8e67uEzFe3kBYfhP6G0Di6hPLILSq1x-iplCJYGIzaEA-kVQQp7ry0LOGjay68UeV09NQl_Q6MQG1tzYIuDRowxiGnTPHqCnKF2ruLlHRIg80uOl8Cfx6vjiyiCcBzx07AWtQD5lj9bxdaEqLdLF4xojGVims1OgBOgEXEj0PdUk4O3fO0VQy9zrMTOslUwsm6EaZ105HllOTodUt9Fy4CUTYbC6WLsR3Cbn2NFbDw8', 'Completed'),
('VEH-002', 'Audi', 'Q8 e-tron', 2023, 'WA1-VA8F2', 'WA1VA8F2D902341', 'E-EV-300KW', 'Electric (EV)', 88150.00, 97500.00, '2023-10-22', 'Main Operating Account (...4492)', 'Audi Central NYC', true, true, 'https://lh3.googleusercontent.com/aida-public/AB6AXuBaTwRYF4nGGvEyKAXeQ2TJxh85EwhuOYeA8e67uEzFe3kBYfhP6G0Di6hPLILSq1x-iplCJYGIzaEA-kVQQp7ry0LOGjay68UeV09NQl_Q6MQG1tzYIuDRowxiGnTPHqCnKF2ruLlHRIg80uOl8Cfx6vjiyiCcBzx07AWtQD5lj9bxdaEqLdLF4xojGVims1OgBOgEXEj0PdUk4O3fO0VQy9zrMTOslUwsm6EaZ105HllOTodUt9Fy4CUTYbC6WLsR3Cbn2NFbDw8', 'In Transit')
ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (id, full_name, father_name, phone_number, id_number, gender, address, city, pincode, occupation, introducer_name, avatar, pan_uploaded, utility_bill_uploaded, crif_score, category, probability, registration_date, status) VALUES
('CUST-001', 'Robert Chambers', 'Arthur Chambers', '9876543210', '3212 4543 9081', 'Male', 'Apt 4B, 221 Baker Street', 'New York', '10001', 'Real Estate Developer', 'Self', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRpgs7Nygdbcs1xdQ8B_-lgFF7YwWBiYcT7OAxmll-BOrzzfXbMfVBg2QR_V-UA4IawO_NH43E8gyH1mqvabtZGhAdhJArm3vFYP2O8G7-6aoCUxpTyMLyhpeb3vUKDsxSFL8iWCVlkPS0uLnMPhNvaZ1lO73DDWQkng7eF8_x-a4auQsiB2QgDgfwFdAb-x-8ax4SQ3Aa5KcboYWA9BCiFGv3rpwXl5_soFqGqKNr7C22JnBymy18UAW-mrOzNE0YChglPd2mz8Y', true, true, 780, 'Prime / Low Risk', '97.2%', '2023-10-18', 'Completed'),
('CUST-002', 'Sarah Jenkins', 'Edward Jenkins', '9123456780', '4452 1102 9923', 'Female', '402 Oak Avenue', 'San Francisco', '94102', 'Corporate Director', 'CUST-001', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnXlMgq-MzWQYeHX3gSwXiAeOyhJCJFajxyBLbt5h6LJrbcokiI1xIKTkx11x6dzB6e60xFz4wMusC90XCiZNzIACGAbAZm34opExyapApZJoXh1GXN6Lt5L81_QDP6TsQDSSEod4KnO_FrcdcHf1OmvMjNBrtjshh5cBppclgx_Ct1Y3GidN6NtPwtk9fCshfnoEAaEyHfiadiTqvxfYPgGrveA5-cr4AVKSOYaiMgTPH3jlgQFthRlrsxCOzwf9-1Kzw6pQs4hE', true, true, 820, 'Prime / Low Risk', '99.1%', '2023-10-22', 'Completed'),
('CUST-003', 'Alice Thompson', 'David Thompson', '9456782312', '8820 4412 1102', 'Female', '88 West End Ave', 'Boston', '02115', 'Consultant', 'CUST-002', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnXlMgq-MzWQYeHX3gSwXiAeOyhJCJFajxyBLbt5h6LJrbcokiI1xIKTkx11x6dzB6e60xFz4wMusC90XCiZNzIACGAbAZm34opExyapApZJoXh1GXN6Lt5L81_QDP6TsQDSSEod4KnO_FrcdcHf1OmvMjNBrtjshh5cBppclgx_Ct1Y3GidN6NtPwtk9fCshfnoEAaEyHfiadiTqvxfYPgGrveA5-cr4AVKSOYaiMgTPH3jlgQFthRlrsxCOzwf9-1Kzw6pQs4hE', true, false, 742, 'Prime / Low Risk', '94.2%', '2023-10-24', 'In Progress')
ON CONFLICT (id) DO NOTHING;

INSERT INTO loans (id, customer_id, customer_name, vehicle_id, vehicle_name, sale_price, down_payment, loan_amount, tenure_months, interest_rate, doc_fee, due_start_date, emi_calculated, status, credit_score, risk_category, default_instances, employment_length, dti_ratio) VALUES
('LN-2023-8842', 'CUST-002', 'Sarah Jenkins', 'VEH-002', 'Audi Q8 e-tron', 45000.00, 5000.00, 40000.00, 36, 4.50, 250.00, '2023-11-01', 1190.13, 'Review', 820, 'LOW RISK', 0, '4.5 Years', '18.4%')
ON CONFLICT (id) DO NOTHING;

INSERT INTO transactions (id, customer, vehicle, amount, status, date) VALUES
('#TXN-88219', 'Robert Chambers', '2023 Tesla Model Y', 1240.00, 'Success', '2023-10-24'),
('#TXN-88220', 'Sarah Jenkins', '2024 Ford F-150', 980.50, 'Success', '2023-10-22'),
('#TXN-88221', 'Michael Scott', '2022 Toyota RAV4', 640.00, 'Failed', '2023-10-21'),
('#TXN-88222', 'Eleanor Shellstrop', '2023 Honda Civic', 410.00, 'Pending', '2023-10-20')
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, username, email, password, full_name, business_name, address, mobile_number, role, status) VALUES
('USR-001', 'admin', 'admin@autofinance.erp', 'admin123', 'Admin User', 'AutoFinance HQ', 'New York Office', '+15550100', 'admin', 'Approved'),
('USR-002', 'staff', 'staff@autofinance.erp', 'staff123', 'Staff Member', 'AutoFinance NYC Branch', 'New York Office', '+15550200', 'user', 'Approved')
ON CONFLICT (id) DO NOTHING;
