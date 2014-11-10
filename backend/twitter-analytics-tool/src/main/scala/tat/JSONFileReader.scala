package tat

import org.apache.spark.SparkContext
import org.apache.spark.SparkContext._
import org.apache.spark.SparkConf
import org.apache.spark.sql._
import org.apache.spark.sql.hive._

/**
* JSONFileReader to read JSON Files and extract data.
*
* Wegen des HiveContext ist mindestens Apache Spark 1.1.0 erforderlich.
* Quellen:
* - http://blog.cloudera.com/blog/2012/11/analyzing-twitter-data-with-hadoop-part-3-querying-semi-structured-data-with-hive/
* - http://apache-spark-user-list.1001560.n3.nabble.com/flattening-a-list-in-spark-sql-td13300.html
* - http://apache-spark-user-list.1001560.n3.nabble.com/Query-the-nested-JSON-data-With-Spark-SQL-1-0-1-td9544.html
*
* @author Patrick Mariot, Florian Willich
**/
class JSONFileReader(sc: SparkContext, pathToJSONFile: String, tempTableName: String) {
	
	val hiveContext: HiveContext = new HiveContext(sc)
	var data = (hiveContext.jsonFile(pathToJSONFile)).registerTempTable(tempTableName)

	def readFile(pathToJSONFile: String, tempTableName: String) {
		data = hiveContext.jsonFile(pathToJSONFile).registerTempTable(tempTableName)
	}

	def createTable(select: String, entities: String, tableName: String) : SchemaRDD = {
		return hiveContext.sql("SELECT " + select + " FROM " + tempTableName + " LATERAL VIEW EXPLODE(" + entities + ") t1 AS " + tableName)
	}

}