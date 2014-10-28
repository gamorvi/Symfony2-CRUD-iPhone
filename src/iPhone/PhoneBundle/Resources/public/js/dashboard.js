$(document).ready(function(){

    var $search = $("#course_search_input");

    var courseList = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('title'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        remote: $search.data('source') + '?q=%QUERY'
    });

    courseList.initialize();

    $("#course_search_input").typeahead({
        hint: false,
        highlight: true
    },{
        name: 'foo',
        displayKey: 'title',
        source: courseList.ttAdapter()
    }).on('typeahead:selected', function(e, obj){
        window.location.href = $(this).data('destination') + obj.id;
    });

    /**
     * Course List Datatable
     */
    $('#course-list').dataTable({
        "asStripeClasses": []
    });

});