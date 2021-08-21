SELECT DISTINCT `firstname`, `lastname`, `apikey`
FROM `##DB##`.`##TB3##`  
WHERE 
	`email` = ?
	AND
	`password`= SHA1(?)
	AND
	`apikey` IS NOT NULL 