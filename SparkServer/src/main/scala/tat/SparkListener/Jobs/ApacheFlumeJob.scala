package tat.SparkListener.Jobs

import scala.util.{Failure, Success, Try}

/**
 * Own imports
 */

import tat.SparkListener.utils.{TypeValidator, ErrorMessage, TypeCreator}
import tat.SparkListener.{JobResult, JobExecutor}
import tat.SparkListener.utils.ApacheFlumeController

class ApacheFlumeJob extends JobExecutor {

  override def executeJob(params: List[String]): JobResult = {
    val afc = new ApacheFlumeController()
    afc.execute(params(0))
  }

}
