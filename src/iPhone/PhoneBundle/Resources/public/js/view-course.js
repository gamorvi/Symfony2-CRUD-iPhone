$(document).ready(function(){

    /**
     * Archive button
     */
    $('#course-archive-button').on('click', function(){
        var btn = $(this);
        btn.button('loading');

        var value = +!btn.data('value'); //invert boolean, typecast back to int
        var href  = btn.data('href');

        $.ajax({
            type: "POST",
            url: href,
            data: {value: value},
            success: function(data){
                btn.button(data)
                btn.data('value', +data);// typecast int

                if(data == 1){
                    btn.removeClass('btn-default');
                    btn.addClass('btn-warning');
                }else{
                    btn.removeClass('btn-warning');
                    btn.addClass('btn-default');
                }
            }
        });
    });



    var updateActionsState = function(){
        $('.actions button').prop('disabled', $('#instances-table tbody input:checked').length == 0);
    }
    updateActionsState();

    /** Toggle checkboxes - instance table **/
    $('#instances-wrap').on('click', '#all-instances', function(){
        $('#instances-table input[type=checkbox]').prop('checked', this.checked);
        updateActionsState();
    })
        .on('click', '#instances-table tbody tr', function(e){
            // clicks on the tr trigger the click on the checkbox
            $('input[type=checkbox]', this).click();
        })
        .on('click', '#instances-table tbody input[type=checkbox]', function(e){
            // gotcha for double event of clicking checkbox and tr via bubble up
            e.stopPropagation();
            updateActionsState();
        })
        .on('click', '#instances-table a', function(e){
            e.stopPropagation(); // make sure clicking on links doesn't trigger a toggle
        });


    /**
     * Update archive state
     */
    var updateArchiveState = function(){
        if($('#show-archived').prop('checked')){
            $('#unarchiveParent').show();
            $('#instances-table tr.archived').show();
        }else{
            $('#instances-table tr.archived').hide();
            $('#unarchiveParent').hide();
        }
    };


    /**
     * Perform archiving of instances
     */
    $('.archive-instances').on('click', function(e){

        var postData = $('input[name="instances[]"]').serializeArray();
        var state    = $(this).data('state');
        postData.push({name:'state', value: state});

        $.post(
            $(this).attr('href'),
            postData,
            function(data){
                $('#instances-wrap').fadeOut(250, function(){
                    $('#instances-table').replaceWith(data);
                    updateArchiveState();
                    $(this).fadeIn(250);
                });

            }
        );

        e.preventDefault();
    });

    /**
     * Toggle display of archived instances
     */
    $('#show-archived').on('click', function(){
        updateArchiveState();
    });
});