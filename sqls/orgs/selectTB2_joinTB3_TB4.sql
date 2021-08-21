SELECT 
	`##TB2##`.`title`,
    `##TB2##`.`begin`,
    `##TB2##`.`end`,
    `room`.`name` AS `local`,
	(SELECT
		GROUP_CONCAT(
             CONCAT(
                `members`.`firstname`, 
                ' ', 
                `members`.`lastname`
             )
             SEPARATOR ', '
         )
         FROM `##TB2##_##TB3##_##TB4##_tbl`
         LEFT JOIN `##TB3##` ON
            `##TB2##_##TB3##_##TB4##_tbl`.`id_##TB3##_fk` = `##TB3##`.`id_##TB3##`
         WHERE 
            `##TB2##_##TB3##_##TB4##_tbl`.`id_##TB2##_fk` = ?
             AND
            `##TB2##_##TB3##_##TB4##_tbl`.`id_##TB4##_fk` = (
            	SELECT 
            		`##TB4##`.`id_##TB4##` 
            	FROM `##TB4##` 
            	WHERE `##TB4##`.`##TB4##` = ?
            )
     ) AS "organizer" ,
     (SELECT
		GROUP_CONCAT(
             CONCAT(
                `members`.`firstname`, 
                ' ', 
                `members`.`lastname`
             )
             SEPARATOR ', '
         )
         FROM `##TB2##_##TB3##_##TB4##_tbl`
         LEFT JOIN `##TB3##` ON
            `##TB2##_##TB3##_##TB4##_tbl`.`id_##TB3##_fk` = `##TB3##`.`id_##TB3##`
         WHERE 
            `##TB2##_##TB3##_##TB4##_tbl`.`id_##TB2##_fk` = ?
             AND
            `##TB2##_##TB3##_##TB4##_tbl`.`id_##TB4##_fk` = (
            	SELECT 
            		`##TB4##`.`id_##TB4##` 
            	FROM `##TB4##` 
            	WHERE `##TB4##`.`##TB4##` = ?
            )
     ) AS "participant" ,
     (SELECT
		GROUP_CONCAT(
             CONCAT(
                `members`.`firstname`, 
                ' ', 
                `members`.`lastname`
             )
             SEPARATOR ', '
         )
         FROM `##TB2##_##TB3##_##TB4##_tbl`
         LEFT JOIN `##TB3##` ON
            `##TB2##_##TB3##_##TB4##_tbl`.`id_##TB3##_fk` = `##TB3##`.`id_##TB3##`
         WHERE 
            `##TB2##_##TB3##_##TB4##_tbl`.`id_##TB2##_fk` = ?
             AND
            `##TB2##_##TB3##_##TB4##_tbl`.`id_##TB4##_fk` = (
            	SELECT 
            		`##TB4##`.`id_##TB4##` 
            	FROM `##TB4##` 
            	WHERE `##TB4##`.`##TB4##` = ?
            )
     ) AS "prepartor" ,
     (SELECT 
      	GROUP_CONCAT(
             CONCAT(
                `tool`.`tool`, 
                ' ', 
                `meeting_tool_tbl`.`quantity`
             )
             SEPARATOR ', '
         )
      	FROM `##TB2##_tool_tbl`
		LEFT JOIN `tool` ON
			`##TB2##_tool_tbl`.`id_tool_fk` = `tool`.`id_tool`
		WHERE `##TB2##_tool_tbl`.`id_##TB2##_fk` = ?
		ORDER BY `tool`.`tool` ASC
     ) AS `tools`
        
FROM `##TB2##_##TB3##_##TB4##_tbl`
LEFT JOIN `##TB2##` ON
	`##TB2##_##TB3##_##TB4##_tbl`.`id_##TB2##_fk` = `##TB2##`.`id_##TB2##`
LEFT JOIN `room` ON
	`##TB2##`.`id_room_fk` = `room`.`id_room`
WHERE `##TB2##_##TB3##_##TB4##_tbl`.`id_##TB2##_fk` = ?
GROUP BY `##TB2##_##TB3##_##TB4##_tbl`.`id_##TB2##_fk`