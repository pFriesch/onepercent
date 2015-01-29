/**
 * View for the TweetsAtDaytime.
 * @author Patrick Mariot
 */
var WordSearchView = Backbone.View.extend({
    /**
     * Constructor for the view.
     * @param options    needs to contain:
     *                    - el:        element where the template gets embedded
     *                    - template: the template to use
     *                    - table:    the table to show
     *                    - searchWord:the word to search for
     */
    initialize: function (options) {
        _.bindAll(this, 'render', 'changeData', 'showChart');
        this.setElement(options.el);
        this.template = _.template(tpl.get(options.template));
        this.path = {
            table: options.table,
            searchWord: encodeURIComponent(options.searchWord)
        };

        if (typeof this.path.searchWord != 'undefined') {
            this.dataCollection = new WordSearchCollection(this.path.table, this.path.searchWord);
            this.dataCollection.fetch({
                success: function (c, r, o) {
                }, error: function (c, r, o) {
                    alert("No data available, try again!");
                }
            });
            this.dataCollection.on('sync', this.showChart);
        }

        this.render();
    },

    render: function () {
        this.$el.html(this.template());
    },

    /**
     * Updates the data for the view.
     * @param table    the table to get the data from
     * @param searchWord    the word to look for
     */
    changeData: function (table, searchWord) {
        console.log(searchWord);
        this.path = {
            table: table,
            searchWord: encodeURIComponent(searchWord)
        };

        if (typeof this.dataCollection != 'undefined') {
            this.dataCollection.remove();
        }

        console.log(this.path.searchWord);

        this.dataCollection = new WordSearchCollection(this.path.table, this.path.searchWord);
        this.dataCollection.fetch({reset: true});
        this.dataCollection.on('sync', this.showChart);
    },

    /**
     * Prepares the data for the chart.
     */
    showChart: function () {
        console.log("test2")

        var timestamps = this.dataCollection.getTimestamps()
        var values = this.dataCollection.getValues();
        var word = this.dataCollection.getUniqNames()[0];

        this.render();
        onepercent.drawLineChart(timestamps, values, word, 'Count');
    }
});