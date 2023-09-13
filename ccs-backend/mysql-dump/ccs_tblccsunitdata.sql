-- MySQL dump 10.13  Distrib 8.0.31, for Win64 (x86_64)
--
-- Host: localhost    Database: ccs
-- ------------------------------------------------------
-- Server version	8.0.31

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `tblccsunitdata`
--

DROP TABLE IF EXISTS `tblccsunitdata`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tblccsunitdata` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `unitIdRef` varchar(50) NOT NULL,
  `status` int(11) DEFAULT NULL,
  `temperature` double DEFAULT NULL,
  `cfm` double DEFAULT NULL,
  `filterLife` double DEFAULT NULL,
  `pwm` int(11) DEFAULT NULL,
  `ps1` double DEFAULT NULL,
  `ps2` double DEFAULT NULL,
  `updateReceived` datetime DEFAULT NULL,
  `power_vdc` float DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `unitIdRef` (`unitIdRef`),
  CONSTRAINT `tblccsunitdata_ibfk_1` FOREIGN KEY (`unitIdRef`) REFERENCES `tblccsunit` (`unitId`)
) ENGINE=InnoDB; 
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblccsunitdata`
--

-- LOCK TABLES `tblccsunitdata` WRITE;
/*!40000 ALTER TABLE `tblccsunitdata` DISABLE KEYS */;