-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema grow
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema grow
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `grow` ;
USE `grow` ;

-- -----------------------------------------------------
-- Table `grow`.`member`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `grow`.`member` (
  `index` INT NOT NULL AUTO_INCREMENT,
  `id` VARCHAR(45) NOT NULL,
  `pw` VARCHAR(300) NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `email_domain` VARCHAR(45) NOT NULL,
  `register_date` DATETIME NOT NULL DEFAULT NOW(),
  `salt` VARCHAR(200) NOT NULL,
  `token` VARCHAR(1000) NULL DEFAULT NULL,
  PRIMARY KEY (`index`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `grow`.`pot`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `grow`.`pot` (
  `index` INT NOT NULL AUTO_INCREMENT,
  `member_index` INT NULL DEFAULT NULL,
  `serial_number` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`index`),
  INDEX `member_index_idx` (`member_index` ASC) VISIBLE,
  CONSTRAINT `fk_member_pot_index`
    FOREIGN KEY (`member_index`)
    REFERENCES `grow`.`member` (`index`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `grow`.`plant_info`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `grow`.`plant_info` (
  `index` INT NOT NULL AUTO_INCREMENT,
  `species` VARCHAR(45) NOT NULL,
  `temperature_upper` INT NULL DEFAULT NULL,
  `temperature_lower` INT NOT NULL,
  `moisture_upper` INT NULL DEFAULT NULL,
  `moisture_lower` INT NULL DEFAULT NULL,
  `light_upper` INT NULL DEFAULT NULL,
  `light_lower` INT NULL DEFAULT NULL,
  `max_water_period` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`index`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `grow`.`plant`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `grow`.`plant` (
  `index` INT NOT NULL AUTO_INCREMENT,
  `pot_index` INT NULL DEFAULT NULL,
  `plant_info_index` INT NULL DEFAULT NULL,
  `start_date` DATETIME NOT NULL DEFAULT NOW(),
  `end_date` DATETIME NULL,
  `plant_name` VARCHAR(45) NOT NULL,
  `child_name` VARCHAR(45) NOT NULL,
  `child_age` INT NOT NULL,
  `complete` INT NOT NULL DEFAULT 0,
  `member_index` INT NOT NULL,
  PRIMARY KEY (`index`),
  INDEX `pot_index_idx` (`pot_index` ASC) VISIBLE,
  INDEX `plant_info_index_idx` (`plant_info_index` ASC) VISIBLE,
  INDEX `fk_member_plant_index_idx` (`member_index` ASC) VISIBLE,
  CONSTRAINT `fk_pot_plant_index`
    FOREIGN KEY (`pot_index`)
    REFERENCES `grow`.`pot` (`index`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_plant_info_plant_index`
    FOREIGN KEY (`plant_info_index`)
    REFERENCES `grow`.`plant_info` (`index`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_member_plant_index`
    FOREIGN KEY (`member_index`)
    REFERENCES `grow`.`member` (`index`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `grow`.`plant_condition`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `grow`.`plant_condition` (
  `index` INT NOT NULL AUTO_INCREMENT,
  `plant_index` INT NOT NULL,
  `temperature` DOUBLE NOT NULL,
  `moisture` DOUBLE NOT NULL,
  `light` DOUBLE NOT NULL,
  `measurement_date` DATETIME NOT NULL DEFAULT NOW(),
  PRIMARY KEY (`index`),
  INDEX `plant_index_idx` (`plant_index` ASC) VISIBLE,
  CONSTRAINT `fk_plant_plant_condition_index`
    FOREIGN KEY (`plant_index`)
    REFERENCES `grow`.`plant` (`index`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `grow`.`chat_log`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `grow`.`chat_log` (
  `index` INT NOT NULL AUTO_INCREMENT,
  `plant_index` INT NOT NULL,
  `role` INT NOT NULL,
  `content` VARCHAR(1000) NOT NULL,
  PRIMARY KEY (`index`),
  INDEX `plant_index_idx` (`plant_index` ASC) VISIBLE,
  CONSTRAINT `fk_plant_chat_log_index`
    FOREIGN KEY (`plant_index`)
    REFERENCES `grow`.`plant` (`index`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `grow`.`water_log`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `grow`.`water_log` (
  `index` INT NOT NULL AUTO_INCREMENT,
  `plant_index` INT NOT NULL,
  `watered_date` DATETIME NOT NULL,
  PRIMARY KEY (`index`),
  INDEX `plant_index_idx` (`plant_index` ASC) VISIBLE,
  CONSTRAINT `fk_plant_water_log_index`
    FOREIGN KEY (`plant_index`)
    REFERENCES `grow`.`plant` (`index`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `grow`.`chat_file`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `grow`.`chat_file` (
  `index` INT NOT NULL AUTO_INCREMENT,
  `chat_log_index` INT NOT NULL,
  `file_name` VARCHAR(100) NOT NULL,
  `file_name_original` VARCHAR(100) NOT NULL,
  `file_url` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`index`),
  UNIQUE INDEX `file_name_UNIQUE` (`file_name` ASC) VISIBLE,
  INDEX `chat_log_index_idx` (`chat_log_index` ASC) VISIBLE,
  UNIQUE INDEX `chat_log_index_UNIQUE` (`chat_log_index` ASC) VISIBLE,
  CONSTRAINT `fk_chat_log_chat_file_index`
    FOREIGN KEY (`chat_log_index`)
    REFERENCES `grow`.`chat_log` (`index`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `grow`.`question`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `grow`.`question` (
  `index` INT NOT NULL AUTO_INCREMENT,
  `plant_index` INT NOT NULL,
  `content` VARCHAR(300) NOT NULL,
  PRIMARY KEY (`index`),
  INDEX `plant_index_idx` (`plant_index` ASC) VISIBLE,
  CONSTRAINT `fk_plant_question_index`
    FOREIGN KEY (`plant_index`)
    REFERENCES `grow`.`plant` (`index`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `grow`.`conjunction`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `grow`.`conjunction` (
  `index` INT NOT NULL AUTO_INCREMENT,
  `content` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`index`),
  UNIQUE INDEX `content_UNIQUE` (`content` ASC) VISIBLE)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
