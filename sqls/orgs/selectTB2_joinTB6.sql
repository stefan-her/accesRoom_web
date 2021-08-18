SELECT 
	`##TB2##`.`id_##TB2##`, 
	`##TB2##`.`title`, 
	`##TB2##`.`begin`, 
	`##TB2##`.`end`, 
	`##TB6##`.`name` AS `##TB6##`,
	IF(`##TB6##`.`open_close` = 1,'close','open') AS `access`, 
	IF(`##TB6##`.`prepared` = 1,'true','false') AS `prepared`
FROM `##TB2##`
LEFT JOIN `##TB6##` ON
	`##TB2##`.`id_##TB6##_fk` = `##TB6##`.`id_##TB6##`
WHERE 
	`##TB2##`.`end` > NOW()
	 AND
    `##TB2##`.`canceled` = 0
ORDER BY `##TB2##`.`begin` ASC
LIMIT ?, ?