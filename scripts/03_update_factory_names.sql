-- Update factory names from old to new
UPDATE factories 
SET name = 'Armana Apparels / Fashions Ltd'
WHERE code = 'DP';

UPDATE factories 
SET name = 'Zyta Apparels Ltd'
WHERE code = 'AB';

UPDATE factories 
SET name = 'Denimach Ltd'
WHERE code = 'MK';

UPDATE factories 
SET name = 'Denitex Ltd'
WHERE code = 'VS';

-- Verify the update
SELECT id, code, name, location FROM factories ORDER BY code;
