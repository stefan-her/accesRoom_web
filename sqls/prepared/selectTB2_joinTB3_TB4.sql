SELECT 
	`meeting`.`title`,
    `meeting`.`begin`,
    `meeting`.`end`,
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
         FROM `meeting_members_role_tbl`
         LEFT JOIN `members` ON
            `meeting_members_role_tbl`.`id_members_fk` = `members`.`id_members`
         WHERE 
            `meeting_members_role_tbl`.`id_meeting_fk` = ?
             AND
            `meeting_members_role_tbl`.`id_role_fk` = (
            	SELECT 
            		`role`.`id_role` 
            	FROM `role` 
            	WHERE `role`.`role` = ?
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
         FROM `meeting_members_role_tbl`
         LEFT JOIN `members` ON
            `meeting_members_role_tbl`.`id_members_fk` = `members`.`id_members`
         WHERE 
            `meeting_members_role_tbl`.`id_meeting_fk` = ?
             AND
            `meeting_members_role_tbl`.`id_role_fk` = (
            	SELECT 
            		`role`.`id_role` 
            	FROM `role` 
            	WHERE `role`.`role` = ?
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
         FROM `meeting_members_role_tbl`
         LEFT JOIN `members` ON
            `meeting_members_role_tbl`.`id_members_fk` = `members`.`id_members`
         WHERE 
            `meeting_members_role_tbl`.`id_meeting_fk` = ?
             AND
            `meeting_members_role_tbl`.`id_role_fk` = (
            	SELECT 
            		`role`.`id_role` 
            	FROM `role` 
            	WHERE `role`.`role` = ?
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
      	FROM `meeting_tool_tbl`
		LEFT JOIN `tool` ON
			`meeting_tool_tbl`.`id_tool_fk` = `tool`.`id_tool`
		WHERE `meeting_tool_tbl`.`id_meeting_fk` = ?
		ORDER BY `tool`.`tool` ASC
     ) AS `tools`
        
FROM `meeting_members_role_tbl`
LEFT JOIN `meeting` ON
	`meeting_members_role_tbl`.`id_meeting_fk` = `meeting`.`id_meeting`
LEFT JOIN `room` ON
	`meeting`.`id_room_fk` = `room`.`id_room`
WHERE `meeting_members_role_tbl`.`id_meeting_fk` = ?
GROUP BY `meeting_members_role_tbl`.`id_meeting_fk`