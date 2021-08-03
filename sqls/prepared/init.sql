
CREATE DATABASE IF NOT EXISTS room_access;

USE room_access;

CREATE TABLE `room_access`.`log` 
	( 
		`id_log` INT NOT NULL AUTO_INCREMENT , 
		`content` TEXT NOT NULL , 
		`dateIn` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP , 
		PRIMARY KEY (`id_log`)
	) 
	ENGINE = InnoDB 
	COMMENT = 'table des logs NFC';
	
	
CREATE TABLE `room_access`.`room` 
	( 
		`id_room` INT NOT NULL AUTO_INCREMENT , 
		`name` VARCHAR(255) NOT NULL , 
		`open_close` BOOLEAN NOT NULL DEFAULT FALSE , 
		`prepared` BOOLEAN NOT NULL DEFAULT FALSE , 
		PRIMARY KEY (`id_room`)
	) 
	ENGINE = InnoDB
	COMMENT = 'table des locaux disponibles';
	
CREATE TABLE `room_access`.`meeting` 
	( 
		`id_meeting` INT NOT NULL AUTO_INCREMENT , 
		`id_room_fk` INT NOT NULL , 
		`title` VARCHAR(255) NOT NULL , 
		`begin` DATETIME NOT NULL , 
		`end` DATETIME NULL , 
		PRIMARY KEY (`id_meeting`), 
		INDEX (`id_room_fk`)
	) 
	ENGINE = InnoDB
	COMMENT = 'table des reunions a venir et passees';
	
CREATE TABLE `room_access`.`role` 
	( 
		`id_role` INT NOT NULL AUTO_INCREMENT , 
		`role` VARCHAR(255) NOT NULL , 
		PRIMARY KEY (`id_role`)
	) 
	ENGINE = InnoDB 
	COMMENT = 'role des personnes dans les reunions';
	
CREATE TABLE `room_access`.`people` 
	( 
		`id_people` INT NOT NULL AUTO_INCREMENT , 
		`firstname` VARCHAR(255) NULL , 
		`lastname` VARCHAR(255) NOT NULL , 
		`password` VARCHAR(255) NOT NULL ,
		`apikey` CHAR(36) NOT NULL , 
		`phone` INT NOT NULL , 
		`email` VARCHAR(255) NULL , 
		PRIMARY KEY (`id_people`)
	) 
	ENGINE = InnoDB 
	COMMENT = 'table des utilisateurs connus dans l\'app';
	
CREATE TABLE `room_access`.`tool` 
	( 
		`id_tool` INT NOT NULL AUTO_INCREMENT , 
		`tool` VARCHAR(255) NOT NULL , 
		PRIMARY KEY (`id_tool`)
	) 
	ENGINE = InnoDB 
	COMMENT = 'ensemble des outils disponibles pour les reunions';	
	
CREATE TABLE `room_access`.`meeting_tool_tbl` 
	( 
		`id_meeting_tool_tbl` INT NOT NULL AUTO_INCREMENT , 
		`id_meeting_fk` INT NOT NULL , 
		`id_tool_fk` INT NOT NULL , 
		`count` INT NOT NULL DEFAULT '1' , 
		PRIMARY KEY (`id_meeting_tool_tbl`), 
		INDEX (`id_meeting_fk`), 
		INDEX (`id_tool_fk`)
	) 
	ENGINE = InnoDB 
	COMMENT = 'liaison entre meeting et tool et la quantite de tool';	
	
CREATE TABLE `room_access`.`meeting_people_role_tbl` 
	( 
		`id_meeting_people_role_tbl` INT NOT NULL AUTO_INCREMENT , 
		`id_meeting_fk` INT NOT NULL , 
		`id_people_fk` INT NOT NULL , 
		`id_role_fk` INT NOT NULL , 
		`log` BOOLEAN NOT NULL DEFAULT FALSE , 
		PRIMARY KEY (`id_meeting_people_role_tbl`), 
		INDEX (`id_meeting_fk`), 
		INDEX (`id_people_fk`), 
		INDEX (`id_role_fk`)
	) 
	ENGINE = InnoDB 
	COMMENT = 'liaison entre meeting et people + role check la presence';


	