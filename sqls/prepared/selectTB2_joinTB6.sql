SELECT 
	`meeting`.`id_meeting`, 
	`meeting`.`title`, 
	`meeting`.`begin`, 
	`meeting`.`end`, 
	`room`.`name` AS `room`,
	IF(`room`.`open_close` = 1,'close','open') AS `access`, 
	IF(`room`.`prepared` = 1,'true','false') AS `prepared`
FROM `meeting`
LEFT JOIN `room` ON
	`meeting`.`id_room_fk` = `room`.`id_room`
WHERE 
	`meeting`.`end` > NOW()
	 AND
    `meeting`.`canceled` = 0
ORDER BY `meeting`.`begin` ASC
LIMIT ?, ?