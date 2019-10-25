BEGIN;

INSERT INTO warehouses
    (city, state, zipcode)
    VALUES
    ('Little Rock','AR','72201'),
    ('Greenwood','IN','46143'),
    ('Canton','MI','48187'),
    ('Canton','MI','48188'),
    ('Greenwood','IN','46142'),
    ('Dover','DE','19902'),
    ('Washington','DC','20020'),
    ('Washington','DC','20001'),
    ('Sacramento','CA','92403'),
    ('Los Angeles','CA','90001'),
    ('Beverly Hills','CA','90209'),
    ('Miami','FL','33124'),
    ('Orlando','FL','32801'),
    ('Atlanta','GA','30301'),
    ('Indianapolis','IN','46225'),
    ('Springfield','IL','62701'),
    ('Des Moines','IA','50301'),
    ('Wichita','KS','67201'),
    ('New Orleans','LA','70112'),
    ('Hazard','KY','41701'),
    ('Freeport','ME','04032'),
    ('Carteret','NJ','07006'),
    ('Avenel','NJ','07001'),
    ('Coldwater','MI','49036');


-- password being inserted are hashed using bcryptjs and salt is 12. 
INSERT INTO carriers
    (username, password, company_name, full_name, mc_num)
    VALUES
    ('romiaujla', '$2a$12$AJQDMQE7C2rKWZHcMiQjqeVZASFQXuz2tHGQu1hIUs6444OMmezjW', 'aujla star transport llc', 'ramanpreet singh aujla', '968302'),
    ('dundermifflin', '$2a$12$fN64sChSm6YICplSHtc70eM8v3auCG6cdzSjZyP5bCLDE9kDsQQPe', 'dunder mifflin trucking llc', 'dunder mifflin', '001234'),
    ('newuser', 'password', 'New User Trucking LLC', 'New User', '000000');


INSERT INTO equipments
    (unit_num, carrier_id)
    VALUES
    ('101', 1),
    ('102', 1),
    ('103', 1),
    ('104', 1),
    ('105', 1),
    ('106', 1),
    ('749', 2),
    ('701', 2),
    ('703', 2),
    ('707', 2),
    ('1545', 2),
    ('166', 2);

-- inserting inactive equipment
INSERT INTO equipments
    (unit_num, carrier_id, status)
    VALUES
    ('1001', 1, 'inactive'),
    ('5145', 2, 'inactive'),
    ('3333', 1, 'inactive');

INSERT INTO drivers
    (full_name, pay_rate, equipment_id, carrier_id)
    VALUES
    ('William Bradley', 0.36, 1, 1),
    ('David Richards', 0.42, 2, 1),
    ('Pros Savath', 0.45, 3, 1),
    ('John Kennedy', 0.42, 4, 1),
    ('Brian Lewis', 0.42, 5, 1),
    ('Albert Placeres', 0.43, 6, 1),
    ('Lamont Squires', 0.44, 7, 2),
    ('Lamont Purnell', 0.44, 8, 2),
    ('Timothy Squires', 0.40, null, 1),
    ('Leia Goodwin', 0.45, null, 2),
    ('Sondra Buelow', 0.45, null, 2),
    ('Billy Fritts', 0.45, null, 2),
    ('Verdie Drey', 0.50, null, 2),
    ('Ruby Kimsey', 0.51, null, 2);

-- adding 4 inactive drivers
INSERT INTO drivers
    (full_name, pay_rate, equipment_id, carrier_id, status)
    VALUES
    ('Katrina Guth', 0.00, null, 1, 'inactive'),
    ('Nickie Connery', 0.00, null, 1, 'inactive'),
    ('Alfred Wiebe', 0.00, null, 2, 'inactive'),
    ('Tianna Holmberg', 0.00, null, 2, 'inactive');


COMMIT;