/**
 * Type representing the CategoryDistributionJob for DB access.
 * @author Patrick Mariot
 */
var job = require('./jobPrototype.js');
var dataBaseHandler = require('../sqlDatabase.js');


// initialize constructor
var CategoryDistributionJob = function (name, table, columnNames) {
    job.call(this, name, table, columnNames); // calls parent
};

CategoryDistributionJob.prototype = Object.create(job.prototype); // javascript inheritance implementation

CategoryDistributionJob.prototype.constructor = CategoryDistributionJob; // this constructor not the parentscon.

// overrides the saveToDatabase methode
CategoryDistributionJob.prototype.saveToDatabase = function (rD, jD) {
    for (var i = 0; i < rD.jobResult.distribution.length; i++) {
        // to access data you must access the "jobResult" Field in rD
        dataBaseHandler.insert(this.getTable(), this.getColumnNames(), [rD.jobResult.distribution[i].category, rD.jobResult.distribution[i].count, jD.params[0]]);
    }
    for (var i = 0; i < rD.jobResult.tweets.length; i++) {
        for (var j = 0; j < rD.jobResult.tweets[i].categoryProb.length; j++) {
            dataBaseHandler.insert("tweetcategorydistribution", ["timestamp", "category", "probability", "tweet"], [jD.params[0], rD.jobResult.tweets[i].categoryProb[j].category, rD.jobResult.tweets[i].categoryProb[j].prob, rD.jobResult.tweets[i].text]);
        }
    }
    // why is one cloumn called time, makes things extra complicated
    dataBaseHandler.insert("countallcategorytweets", ["count", "timestamp"], [rD.jobResult.totalCount, jD.params[0]]);
};

module.exports = CategoryDistributionJob;
