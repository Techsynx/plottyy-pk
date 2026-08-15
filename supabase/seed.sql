-- Plottyy Seed Data for Pakistani Real Estate Marketplace

-- 1. Insert Demo Profile
INSERT INTO profiles (id, full_name, phone_number, phone_verified_at, avatar_url, role, agency_name, is_verified, bio)
VALUES 
('a0000000-0000-0000-0000-000000000001', 'Malik Tariq Mehmood', '+923001234567', now(), 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80', 'lister', 'Al-Rehman Real Estate & Builders', true, 'Over 15 years of experience in DHA Lahore, Bahria Town, and Gwadar residential & commercial investments.'),
('a0000000-0000-0000-0000-000000000002', 'Farhan Siddiqui', '+923219876543', now(), 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', 'lister', 'Apex Properties Islamabad', true, 'Specializing in CDA sectors (F-6, F-7, E-11) and Gulberg Greens Islamabad.'),
('a0000000-0000-0000-0000-000000000003', 'Chaudhry Bilal Aslam', '+923334445566', now(), 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', 'lister', 'Direct Property Owner', true, 'Direct owner with verified possession and title deeds.')
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Cities
INSERT INTO cities (id, name, slug, province, is_active, sort_order)
VALUES
(1, 'Lahore', 'lahore', 'Punjab', true, 1),
(2, 'Islamabad', 'islamabad', 'Islamabad Capital Territory', true, 2),
(3, 'Karachi', 'karachi', 'Sindh', true, 3),
(4, 'Rawalpindi', 'rawalpindi', 'Punjab', true, 4),
(5, 'Peshawar', 'peshawar', 'Khyber Pakhtunkhwa', true, 5),
(6, 'Faisalabad', 'faisalabad', 'Punjab', true, 6),
(7, 'Multan', 'multan', 'Punjab', true, 7),
(8, 'Gwadar', 'gwadar', 'Balochistan', true, 8)
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Locations (Societies / Sectors / Phases)
INSERT INTO locations (id, city_id, parent_id, name, slug, full_address_path, is_popular)
VALUES
-- Lahore Locations
(101, 1, NULL, 'DHA Defence', 'dha-defence', 'Lahore > DHA Defence', true),
(102, 1, 101, 'DHA Phase 6', 'dha-phase-6', 'Lahore > DHA Defence > Phase 6', true),
(103, 1, 101, 'DHA Phase 5', 'dha-phase-5', 'Lahore > DHA Defence > Phase 5', true),
(104, 1, 101, 'DHA Phase 8 (Ex-Air Avenue)', 'dha-phase-8', 'Lahore > DHA Defence > Phase 8', true),
(105, 1, 101, 'DHA Phase 9 Prism', 'dha-phase-9-prism', 'Lahore > DHA Defence > Phase 9 Prism', true),
(106, 1, NULL, 'Bahria Town', 'bahria-town-lahore', 'Lahore > Bahria Town', true),
(107, 1, 106, 'Sector C', 'sector-c', 'Lahore > Bahria Town > Sector C', true),
(108, 1, 106, 'Sector J', 'sector-j', 'Lahore > Bahria Town > Sector J', false),
(109, 1, NULL, 'Gulberg', 'gulberg-lahore', 'Lahore > Gulberg', true),
(110, 1, 109, 'Gulberg III', 'gulberg-iii', 'Lahore > Gulberg > Gulberg III', true),
(111, 1, NULL, 'Lake City', 'lake-city-lahore', 'Lahore > Lake City', true),
(112, 1, NULL, 'Model Town', 'model-town-lahore', 'Lahore > Model Town', true),

-- Islamabad Locations
(201, 2, NULL, 'DHA Defence', 'dha-islamabad', 'Islamabad > DHA Defence', true),
(202, 2, 201, 'DHA Phase 2', 'dha-phase-2-isb', 'Islamabad > DHA Defence > Phase 2', true),
(203, 2, NULL, 'Bahria Town', 'bahria-town-isb', 'Islamabad > Bahria Town', true),
(204, 2, 203, 'Bahria Town Phase 8', 'bahria-phase-8-isb', 'Islamabad > Bahria Town > Phase 8', true),
(205, 2, NULL, 'Sector F-7', 'sector-f-7', 'Islamabad > Sector F-7', true),
(206, 2, NULL, 'Sector E-11', 'sector-e-11', 'Islamabad > Sector E-11', true),
(207, 2, NULL, 'Gulberg Greens', 'gulberg-greens', 'Islamabad > Gulberg Greens', true),
(208, 2, NULL, 'B-17 Multi Gardens', 'b-17-multi-gardens', 'Islamabad > B-17 Multi Gardens', true),

-- Karachi Locations
(301, 3, NULL, 'DHA Defence', 'dha-karachi', 'Karachi > DHA Defence', true),
(302, 3, 301, 'DHA Phase 8', 'dha-phase-8-khi', 'Karachi > DHA Defence > Phase 8', true),
(303, 3, 301, 'DHA Phase 6', 'dha-phase-6-khi', 'Karachi > DHA Defence > Phase 6', true),
(304, 3, NULL, 'Bahria Town Karachi', 'bahria-town-karachi', 'Karachi > Bahria Town Karachi', true),
(305, 3, NULL, 'Clifton', 'clifton-karachi', 'Karachi > Clifton', true),
(306, 3, NULL, 'Gulshan-e-Iqbal', 'gulshan-e-iqbal', 'Karachi > Gulshan-e-Iqbal', true)
ON CONFLICT (id) DO NOTHING;

-- Reset Sequences
SELECT setval('cities_id_seq', (SELECT MAX(id) FROM cities));
SELECT setval('locations_id_seq', (SELECT MAX(id) FROM locations));
