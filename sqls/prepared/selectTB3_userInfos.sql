SELECT DISTINCT `firstname`, `lastname`, `apikey`
FROM `room_access`.`members`  
WHERE 
	`email` = ?
	AND
	`password`= SHA1(?)
	AND
	`apikey` IS NOT NULL 