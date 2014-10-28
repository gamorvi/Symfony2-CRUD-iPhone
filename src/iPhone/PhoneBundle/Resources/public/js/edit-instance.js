$(document).ready(function(){

    /**
     * Ensure the checkbox states are reflected in the css/disabled fields
     */
    var checkEditFieldState = function(){
        $('#edit-sessions-modal :checkbox').each(function(){
            var $this = $(this);

            // use data-target to get the target element to manipulate
            var $target = $($this.data('target'));

            if($this.is(':checked')){
                // toggle class
                $target.addClass('edit-enabled');
                $target.removeClass('edit-disabled');

                // toggle disabled
                $(':input', $target).attr('disabled', false);
            }else{
                // toggle class
                $target.removeClass('edit-enabled');
                $target.addClass('edit-disabled');

                // toggle disabled
                $(':input', $target).attr('disabled', true);
            }
        });
    }

    /**
     * Venue autocomplete
     */
    var initVenue = function(selector){
        $venue = $('.venue-autocomplete', $(selector));
        var dataSource = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace('text'),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            remote: $venue.data('source') + '?q=%QUERY',
            limit: 12
        });
        dataSource.initialize();

        $venue.typeahead({
            hint: false,
            highlight: true
        },{
            name: 'default',
            displayKey: 'text',
            source: dataSource.ttAdapter()
        });
    }

    var initEditForm = function(){
        checkEditFieldState();
        bindAutocompletes();
        initVenue('#edit-sessions-modal');

        $('#edit-sessions-modal :checkbox').on('click', function(){
            checkEditFieldState();
        });
    }


    /** Bookings dataTable **/
    var initBookingTable = function(){
        $('#bookings-list').dataTable({
            "asStripeClasses": [],
            "bPaginate": false
        });
    };
    initBookingTable();


    var initNewSessionsForm = function(){
        bindAutocompletes();
        initVenue('#add-sessions-modal');
        $('#sessions_date').datepicker({
            format: 'dd/mm/yyyy',
            multidate: true
        });
    };
    initNewSessionsForm();




    /** Add Sessions Trigger (Save new session form) **/
    $('.add-sessions-trigger').on('click', function(e){
        e.preventDefault();
        $form = $('form[name="sessions"]');
        var formData = $form.serialize();

        $.post($form.attr('action'), formData, 'json').done(function(data){

            var $formWrap = $form.closest('.form-wrapper');
            $formWrap.replaceWith(data.html);

            // Rebind some events on the replaced html
            $form = $('form[name="sessions"]'); // re-select
            initNewSessionsForm();

            // Close modal and refresh sessions table
            if(data.success){
               $form.closest('.modal').modal('hide');

               $sessions = $('#instance-sessions');
               $sessions.hide(0);
               $.get($sessions.data('src'), function(data){
                   $sessions.replaceWith(data);
                   $sessions.fadeIn(500);
                   $('.session-count').html($('#instance-sessions table tbody input').length);
               });
}
        });
    });

    /** Edit Sessions Save **/
    $('.edit-sessions-save').on('click', function(e){
        e.preventDefault();
        $form = $('form[name="edit_sessions"]');

        // remove any disabled attributes to serialize everything
        var disabled = $form.find(':input:disabled').removeAttr('disabled');

        // do serialization
        var formData = $form.serializeArray();

        // append the sessions being edited
        $.merge(formData, $('input[name="sessions[]"]').serializeArray());

        // ajax post the data
        $.post($form.attr('action'), formData, 'json').done(function(data){

            var $formWrap = $form.closest('.form-wrapper');
            $formWrap.replaceWith(data.html);
            initEditForm();

            // Close modal and refresh sessions table
            if(data.success){
                $('form[name="edit_sessions"]').closest('.modal').modal('hide');

                $sessions = $('#instance-sessions');
                $sessions.hide(0);
                $.get($sessions.data('src'), function(data){
                    $sessions.replaceWith(data);
                    $sessions.fadeIn(500);
                    $('.session-count').html($('#instance-sessions table tbody input').length);
                });
            }
        });
    });






    /** Toggle checkboxes (sessions table), delete button **/
    $('#instance-sessions-wrap').on('click', '.sessions-checkbox-toggle', function(){
        $('#instance-sessions input[type=checkbox]').prop('checked', this.checked);
        $('.actions button').prop('disabled', $('#instance-sessions table tbody input:checked').length == 0);
    });
    $('#instance-sessions-wrap')
        .on('click', '#instance-sessions table tbody tr', function(e){
            $('input[type=checkbox]', this).click();
        })
        .on('click', '#instance-sessions table tbody input[type=checkbox]', function(e){
            // Checkbox click
            e.stopPropagation();
        })
        .on('click', '.delete-sessions-trigger', function(e){
            var count = $('#instance-sessions table tbody input:checked').length;
            if(count){
                $('#delete-sessions-count').html(count);
                if(count > 1){
                    $('#delete-pural').show();
                }else{
                    $('#delete-pural').hide();
                }

                $('#delete-sessions-modal').modal('show');
            }
            e.stopPropagation();
        })
        .on('click', '.edit-sessions-trigger', function(e){
            e.preventDefault();
            $this = $(this);

            $('#edit-sessions-modal')
                .modal('show')
                .find('.modal-body')
                .load($this.prop('href') + '?' + $('input[name="sessions[]"]').serialize(), function(){
                    initEditForm();
                });

        })
        .on('click', '#instance-sessions table tbody input[type=checkbox]', function(){
            $('.actions button').prop('disabled', $('#instance-sessions table tbody input:checked').length == 0);
        })
        .on('click', '.submit-attendance', function(e){
            e.stopPropagation();
        });


    /** Delete Sessions Confirmed **/
    $('.delete-sessions-confirmed').on('click', function(e){
        var $this = $(this);
        var $sessions = $('#instance-sessions');
        $sessions.hide(0);

        $.post(
            $(this).attr('href'),
            $('input[name="sessions[]"]').serializeArray(),
            function(data){
                $this.closest('.modal').modal('hide');
                $sessions.replaceWith(data);
                $sessions.fadeIn(500);
                $('.session-count').html($('#instance-sessions table tbody input').length);
            }
        )

        e.preventDefault();
    });


    /** Attendance form **/
    var currentAttButton = null;

    $('#instance-sessions-wrap').on('click', '.add-attendance-trigger', function(e){
        var $this = $(this);
        currentAttButton = $this;

        e.stopPropagation();
        e.preventDefault();

        $('#attendance-modal')
            .modal('show')
            .find('.modal-dialog')
            .load($this.prop('href'), function(){
                updateAttendanceTableRows();
            });
    });

    $('#attendance-modal').on('click', '#markAsFull', function(e){
        e.preventDefault();

        $('#attendanceTable tr').each(function(i, el){
            var $el = $(el);
            if($('input:checked', $el).length == 0){
                $('input[value="full"]', $el).prop("checked", true);
                updateAttendanceTableRows();
            };
        });
    });

    $('#attendance-modal').on('submit', 'form', function(e){
        e.preventDefault();

        var $this = $(this);

        $.post(
            $(this).attr('action'),
            $(this).serialize(),
            function(data){
                $this.closest('.modal').modal('hide');
                currentAttButton.html(data);
            }
        );
    }).on("change", ":radio", function(){
        updateAttendanceTableRows();
    });


    /**
     * Attendance toggle
     */
    var updateAttendanceTableRows = function(){
        $("#attendanceTable tr").each(function(i, el){

           var $el = $(el);

           // must be a better way of doing this!
           switch($(":checked", el).val()){
               case 'none':
                   $el.removeClass('success warning');
                   $el.addClass('danger');
                   break;

               case 'full':
                   $el.removeClass('danger warning');
                   $el.addClass('success');
                   break;

               case 'partial':
                   $el.removeClass('danger success');
                   $el.addClass('warning');
                   break;

           }
        });
    };
    updateAttendanceTableRows();


    /**
     * Refresh bookings
     */
    $('.refresh-bookings').click(function (e) {
        e.preventDefault();

        var btn = $(this);
        btn.button('loading');

        var $table = $('#bookings-list-wrap');
        $table.fadeTo(0, 0.5);

        $.post(btn.attr('data-href')).always(function () {
            btn.button('reset')
        }).done(function(data){

            $table.replaceWith(data);
            initBookingTable();
            $table.fadeIn(500);

            $('.bookings-count').html($('#bookings-list tbody tr.booking-row').length);

            // Refresh sessions table (refactor this... copied from above)
            var $sessions = $('#instance-sessions');
            $sessions.hide(0);
            $.get($sessions.data('src'), function(data){
                $sessions.replaceWith(data);
                $sessions.fadeIn(500);
                $('.session-count').html($('#instance-sessions table tbody input').length);
            });
        });


    });




});