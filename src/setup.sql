CREATE TABLE organization (
    organization_ID SERIAL PRIMARY KEY,
	name VARCHAR(50) NOT NULL,
	description TEXT NOT NULL,
	contact_email VARCHAR(255) NOT NULL,
	logo_filename VARCHAR(255) NOT NULL
);

INSERT INTO organization (name, description, contact_email, logo_filename) 
VALUES 
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');

CREATE TABLE project (
    project_id SERIAL PRIMARY KEY,
    organization_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    CONSTRAINT fk_organization 
        FOREIGN KEY (organization_id) 
        REFERENCES organization(organization_id)
        ON DELETE CASCADE
);

INSERT INTO project (organization_id, title, description, location, date) 
VALUES 

(1, 'Community Center Renovation', 'Repairing the roof and walls of the local community center.', '123 Main St, Downtown', '2026-06-15'),
(1, 'Eco-Friendly Park Benches', 'Building and installing benches made from recycled plastic.', 'Greenwood Park', '2026-07-22'),
(1, 'Solar Panel Installation', 'Installing solar panels on the community clinic roof.', '456 Health Ave', '2026-08-05'),
(1, 'Library Painting & Repair', 'Fresh coat of paint and shelving repairs for the youth library.', '789 Education Rd', '2026-09-12'),
(1, 'Sustainable Greenhouse Build', 'Constructing a solar-powered greenhouse for winter crops.', 'Community Garden Plots', '2026-10-01'),

(2, 'Urban Vegetable Planting', 'Planting tomatoes, lettuce, and carrots in local neighborhood lots.', 'East Side Community Garden', '2026-06-20'),
(2, 'Composting Workshop Setup', 'Building dual-bin compost systems and training neighbors.', 'North Neighborhood Hub', '2026-07-10'),
(2, 'Rainwater Harvesting System', 'Setting up water collection barrels and irrigation grids.', 'South Farms', '2026-08-18'),
(2, 'Fruit Tree Orchard Planting', 'Planting 30 apple and pear trees in the public community space.', 'West Park Extension', '2026-09-05'),
(2, 'Seed Swapping Event', 'Organizing a community day to share organic seeds and knowledge.', 'Central Plaza', '2026-10-15'),

(3, 'Local Food Drive Logistics', 'Sorting, packing, and distributing non-perishable food boxes.', 'UnityServe Depot', '2026-06-10'),
(3, 'Senior Citizen Tech Support', 'One-on-one tutoring for elderly residents using smartphones.', 'Golden Age Community Home', '2026-07-14'),
(3, 'Back-to-School Backpack Drive', 'Filling backpacks with school supplies for underprivileged kids.', 'Civic Center Hall B', '2026-08-25'),
(3, 'Neighborhood Clean-up Day', 'Clearing trash and creating a flower bed along the old river path.', 'River Side Trail', '2026-09-20'),
(3, 'Winter Clothing Sorting', 'Organizing donated coats, blankets, and gloves for shelters.', 'UnityServe Depot', '2026-11-02');

CREATE TABLE IF NOT EXISTS public.projects (
    project_id SERIAL PRIMARY KEY,
    organization_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(200) NOT NULL,
    date DATE NOT NULL,
    CONSTRAINT fk_organization 
        FOREIGN KEY(organization_id) 
        REFERENCES public.organizations(organization_id)
        ON DELETE CASCADE
);

INSERT INTO public.projects (organization_id, title, description, location, date) VALUES
-- Organization 1 (Eco Warriors)
(1, 'Beach Cleanup Drive', 'Collecting plastics and trash along the central coast.', 'Central Beach', '2026-06-15'),
(1, 'Urban Reforestation', 'Planting native trees in the north community park.', 'North Park', '2026-07-20'),
(1, 'Community Recycling Workshop', 'Teaching neighbors how to sort waste correctly.', 'Community Center', '2026-08-05'),
(1, 'Trail Maintenance', 'Clearing and repairing walking paths in the mountain.', 'Eagle Trail', '2026-09-12'),
(1, 'River Basin Cleaning', 'Removing floating debris from the river bank.', 'Serene River', '2026-10-01'),

-- Organization 2 (Educate Now)
(2, 'Primary School Tutoring', 'Helping kids with their homework and basic math.', 'Public Library', '2026-06-18'),
(2, 'Book Donation Drive', 'Collecting and sorting textbooks for local schools.', 'San Jose College', '2026-07-22'),
(2, 'Basic Computer Classes', 'Teaching digital skills to elderly citizens.', 'Digital Hub', '2026-08-10'),
(2, 'Adult Literacy Program', 'Intensive reading and writing sessions for adults.', 'Community Hall', '2026-09-15'),
(2, 'Local Science Fair Mentorship', 'Guiding students with their science projects.', 'Main Square', '2026-10-05'),

-- Organization 3 (Hope Kitchen)
(3, 'Soup Kitchen Volunteering', 'Preparing and distributing hot meals to people in need.', 'Central Kitchen', '2026-06-20'),
(3, 'Free Health Checkup Logistics', 'Helping organize rows and registrations for patients.', 'Municipal Clinic', '2026-07-25'),
(3, 'Winter Clothing Drive', 'Sorting and packing coats and blankets for families.', 'Support Warehouse', '2026-08-12'),
(3, 'Food Bank Box Packing', 'Assembling basic food baskets for local neighborhoods.', 'Storage Center', '2026-09-20'),
(3, 'Vaccination Campaign Support', 'Providing logistical help during the health day.', 'Health Park', '2026-10-10');

CREATE TABLE IF NOT EXISTS public.categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.project_categories (
    project_id INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (project_id, category_id),
    CONSTRAINT fk_project FOREIGN KEY (project_id) REFERENCES public.projects(project_id) ON DELETE CASCADE,
    CONSTRAINT fk_category FOREIGN KEY (category_id) REFERENCES public.categories(category_id) ON DELETE CASCADE
);

INSERT INTO public.categories (category_name) VALUES 
('Environmental'),
('Educational'),
('Community Service'),
('Health & Wellness');

INSERT INTO public.project_categories (project_id, category_id) VALUES
-- (Asociados a Environmental, ID 1)
(1, 1),
(2, 1),
(3, 1),
(4, 1),
(5, 1),

--(Asociados a Educational, ID 2)
(6, 2),
(7, 2),
(8, 2),
(9, 2),
(10, 2),

--(Asociados a Community Service, ID 3 y Health & Wellness, ID 4)
(11, 3),
(12, 4),
(13, 3),
(14, 3),
(15, 4);
