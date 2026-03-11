-- Update factory names and locations to Bangladesh
UPDATE factories 
SET name = 'Armana Apparels / Fashions Ltd',
    location = 'Tejgaon Industrial Area, Dhaka'
WHERE code = 'DP';

UPDATE factories 
SET name = 'Zyta Apparels Ltd',
    location = 'Mirpur, Dhaka'
WHERE code = 'AB';

UPDATE factories 
SET name = 'Denimach Ltd',
    location = 'Sreepur, Gazipur'
WHERE code = 'MK';

UPDATE factories 
SET name = 'Denitex Ltd',
    location = 'Savar, Dhaka'
WHERE code = 'VS';

-- Verify the update
SELECT id, code, name, location FROM factories ORDER BY code;
