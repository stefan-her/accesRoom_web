SELECT `tool`.`tool` AS `tool`, `meeting_tool_tbl`.`quantity`
FROM `meeting_tool_tbl`
LEFT JOIN `tool` ON
	`meeting_tool_tbl`.`id_tool_fk` = `tool`.`id_tool`
WHERE `meeting_tool_tbl`.`id_meeting_fk` = ?
ORDER BY `tool`.`tool` ASC