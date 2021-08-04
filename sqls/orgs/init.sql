
CREATE DATABASE IF NOT EXISTS ##DB##;

USE ##DB##;

CREATE TABLE `##DB##`.`##TB1##` 
	( 
		`id_##TB1##` INT NOT NULL AUTO_INCREMENT , 
		`content` TEXT NOT NULL , 
		`dateIn` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP , 
		PRIMARY KEY (`id_##TB1##`)
	) 
	ENGINE = InnoDB 
	COMMENT = 'table des logs NFC';
	
	
CREATE TABLE `##DB##`.`##TB6##` 
	( 
		`id_##TB6##` INT NOT NULL AUTO_INCREMENT , 
		`name` VARCHAR(255) NOT NULL , 
		`open_close` BOOLEAN NOT NULL DEFAULT FALSE , 
		`prepared` BOOLEAN NOT NULL DEFAULT FALSE , 
		PRIMARY KEY (`id_##TB6##`)
	) 
	ENGINE = InnoDB
	COMMENT = 'table des locaux disponibles';
	
CREATE TABLE `##DB##`.`##TB2##` 
	( 
		`id_##TB2##` INT NOT NULL AUTO_INCREMENT , 
		`id_##TB6##_fk` INT NOT NULL , 
		`title` VARCHAR(255) NOT NULL , 
		`begin` DATETIME NOT NULL , 
		`end` DATETIME NULL , 
		PRIMARY KEY (`id_##TB2##`), 
		INDEX (`id_##TB6##_fk`)
	) 
	ENGINE = InnoDB
	COMMENT = 'table des reunions a venir et passees';
	
CREATE TABLE `##DB##`.`##TB4##` 
	( 
		`id_##TB4##` INT NOT NULL AUTO_INCREMENT , 
		`##TB4##` VARCHAR(255) NOT NULL , 
		PRIMARY KEY (`id_##TB4##`)
	) 
	ENGINE = InnoDB 
	COMMENT = '##TB4## des personnes dans les reunions';
	
CREATE TABLE `##DB##`.`##TB3##` 
	( 
		`id_##TB3##` INT NOT NULL AUTO_INCREMENT , 
		`firstname` VARCHAR(255) NULL , 
		`lastname` VARCHAR(255) NOT NULL , 
		`password` VARCHAR(255) NOT NULL ,
		`apikey` CHAR(36) NOT NULL , 
		`phone` INT NOT NULL , 
		`email` VARCHAR(255) NULL , 
		`master` BOOLEAN NOT NULL DEFAULT FALSE ,
		PRIMARY KEY (`id_##TB3##`)
	) 
	ENGINE = InnoDB 
	COMMENT = 'table des utilisateurs connus dans l\'app';
	
CREATE TABLE `##DB##`.`##TB5##` 
	( 
		`id_##TB5##` INT NOT NULL AUTO_INCREMENT , 
		`##TB5##` VARCHAR(255) NOT NULL , 
		PRIMARY KEY (`id_##TB5##`)
	) 
	ENGINE = InnoDB 
	COMMENT = 'ensemble des outils disponibles pour les reunions';	
	
CREATE TABLE `##DB##`.`##TB2##_##TB5##_tbl` 
	( 
		`id_##TB2##_##TB5##_tbl` INT NOT NULL AUTO_INCREMENT , 
		`id_##TB2##_fk` INT NOT NULL , 
		`id_##TB5##_fk` INT NOT NULL , 
		`count` INT NOT NULL DEFAULT '1' , 
		PRIMARY KEY (`id_##TB2##_##TB5##_tbl`), 
		INDEX (`id_##TB2##_fk`), 
		INDEX (`id_##TB5##_fk`)
	) 
	ENGINE = InnoDB 
	COMMENT = 'liaison entre ##TB2## et ##TB5## et la quantite de ##TB5##';	
	
CREATE TABLE `##DB##`.`##TB2##_##TB3##_##TB4##_tbl` 
	( 
		`id_##TB2##_##TB3##_##TB4##_tbl` INT NOT NULL AUTO_INCREMENT , 
		`id_##TB2##_fk` INT NOT NULL , 
		`id_##TB3##_fk` INT NOT NULL , 
		`id_##TB4##_fk` INT NOT NULL , 
		`log` BOOLEAN NOT NULL DEFAULT FALSE , 
		PRIMARY KEY (`id_##TB2##_##TB3##_##TB4##_tbl`), 
		INDEX (`id_##TB2##_fk`), 
		INDEX (`id_##TB3##_fk`), 
		INDEX (`id_##TB4##_fk`)
	) 
	ENGINE = InnoDB 
	COMMENT = 'liaison entre ##TB2## et ##TB3## + ##TB4## check la presence';


	