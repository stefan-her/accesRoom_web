SELECT COLUMN_NAME, DATA_TYPE
FROM information_schema.columns 
WHERE table_name = ? 
AND table_schema='room_access' 