SELECT `id_log` AS `id` , `content`, `dateIn` AS `date`
FROM `room_access`.`log` 
ORDER BY `id_log` ASC 
LIMIT ?, ?