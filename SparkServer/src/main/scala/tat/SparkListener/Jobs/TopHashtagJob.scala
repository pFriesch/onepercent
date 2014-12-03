package tat.SparkListener.Jobs

import java.text.SimpleDateFormat

import org.apache.spark.sql.hive._
import org.apache.spark.{SparkConf, SparkContext}

import scala.util.{Failure, Success, Try}

/**
  * Own imports
 */
import tat.SparkListener.utils.{TypeValidator, Error, TypeCreator}
import tat.SparkListener.JobExecutor
import tat.SparkListener.utils.TweetAnalyser

class TopHashtagJob extends JobExecutor {

  override def executeJob(params: Array[String]): AnyRef = {

    TypeValidator.validateTime(params(0), new SimpleDateFormat("yyyy-mm-dd hh")) match {
      case Success(Success(gregCalendar)) =>

        TypeCreator.createClusterPath(params(1), gregCalendar, "*.data") match {
          case Success(path) =>

            Try(params(2).toInt) match {
              case Success(topX) =>
                val conf = new SparkConf().setAppName("Twitter Hashtags Top 10")
                val sc = new SparkContext(conf)
                val hc = new HiveContext(sc)
                val ta = new TweetAnalyser(sc, hc)
                ta.topHashtagAnalyser(path, topX)

              case Failure(wrongTopX) =>
                Error("Parameter [" + wrongTopX + "] is not an Integer!", 100)

            }

          case Failure(wrongPath) =>
            Error("Parameter [" + wrongPath + "] i not a valid path!", 100)

        }

      case Failure(wrongDate) =>
        Error("Parameter [" + wrongDate + "] is not a valid date!", 100)

    }

  }

}