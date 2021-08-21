SELECT `##TB5##`.`##TB5##` AS `##TB5##`, `##TB2##_##TB5##_tbl`.`quantity`
FROM `##TB2##_##TB5##_tbl`
LEFT JOIN `##TB5##` ON
	`##TB2##_##TB5##_tbl`.`id_##TB5##_fk` = `##TB5##`.`id_##TB5##`
WHERE `##TB2##_##TB5##_tbl`.`id_##TB2##_fk` = ?
ORDER BY `##TB5##`.`##TB5##` ASC