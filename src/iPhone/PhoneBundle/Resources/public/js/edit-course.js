$(document).ready(function(){

    /** Dynamic select box for Sub Department */
    var options = $("#course_edit_subDepartment optgroup").detach();

    var filterOptions = function(){
        var department = $("#course_edit_department option:selected").text();
        var filtered = $(options).filter("[label='" + department + "']");
        $("#course_edit_subDepartment").html(filtered);
    };
    $("#course_edit_department").on("change", filterOptions);
    filterOptions();


    /** Autocomplete Tag Field for adminStaff **/

    var adminStaffInput = $('#course_edit_adminStaff');
    var staffList = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('text'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        remote: adminStaffInput.data('source') + '?q=%QUERY',
        limit: 12
    });
    staffList.initialize();



    // init the tagsinput
    adminStaffInput.tagsinput({
        itemValue: 'id',
        itemText: 'text',
        tagClass: function(){return "label label-person";}
    });

    // convert selected items into tags
    $('option:selected', adminStaffInput).each(function(i, element){
        adminStaffInput.tagsinput('add', {'id':$(element).val(), 'text':$(element).text()});
    });

    // hook-up the typeahead autocomplete
    adminStaffInput.tagsinput('input').typeahead({
        hint: false,
        highlight: true
    },{
        name: 'stafflist',
        displayKey: 'text',
        source: staffList.ttAdapter()
    }).on('typeahead:selected', function (e, obj){
        adminStaffInput.tagsinput('add', {id: obj.id, text: obj.text});
        adminStaffInput.tagsinput('input').typeahead('val', '');
    });



    /**
     * Bookable toggle
     */
    $('#course_edit_bookable input[name="course_edit[bookable]"]').change(function(){

       var container = $('#course_edit_bookingAlternative').closest('.form-group');

       if($(this).val() == 0){
           // "No" checked
           $('#course_edit_bookingAlternative').prop('disabled', false);
           container.show().removeClass('hide');
       }else{
           container.hide();
           $('#course_edit_bookingAlternative').prop('disabled', true);

       }
    });


    /**
     * Target Audience Department autocomplete
     */
    var $audience = $('#course_edit_targetAudienceDepartments');

    // configure a bloodhound
    var audienceDepts = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('text'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        remote: $audience.data('source') + '?q=%QUERY',
        limit: 12
    });
    audienceDepts.initialize();

    // init the tagsinput
    $audience.tagsinput({
        itemValue: 'id',
        itemText: 'text'
    });

    // convert selected items into tags
    $('option:selected', $audience).each(function(i, element){
        $audience.tagsinput('add', {'id':$(element).val(), 'text':$(element).text()});
    });

    // hook-up the typeahead autocomplete
    $audience.tagsinput('input').typeahead({
        hint: false,
        highlight: true
    },{
        name: 'stafflist',
        displayKey: 'text',
        source: audienceDepts.ttAdapter()
    }).on('typeahead:selected', function (e, obj){
        $audience.tagsinput('add', {id: obj.id, text: obj.text});
        $audience.tagsinput('input').typeahead('val', '');
    }).prop('placeholder', $audience.data('placeholder'));


});