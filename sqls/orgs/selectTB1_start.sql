SELECT `id_log` AS `id` , `content`, `dateIn` AS `date`
FROM `##DB##`.`##TB1##` 
WHERE `id_##TB1##` > ?
ORDER BY `id_##TB1##` ASC 