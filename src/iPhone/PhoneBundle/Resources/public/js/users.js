$(document).ready(function(){
   bindAutocompletes();

    var toggleTrigger = function(trigger){
        if(trigger.hasClass('glyphicon-plus')){
            trigger.removeClass('glyphicon-plus').addClass('glyphicon-minus');
        }else{
            trigger.removeClass('glyphicon-minus').addClass('glyphicon-plus');
        }
    }

    $('#subDept-wrap').on('click', '.subunit-toggle', function(){
        var $trigger = $(this);
        var $wrap    = $('div.checkbox-wrap', $(this).closest('div.checkbox'));

        toggleTrigger($trigger);
        $wrap.toggle('fast', 'linear');
    });


    $('#subDept-wrap').on('click', '.checkbox-trigger', function(){
        var $wrap = $('.checkbox-wrap', $(this).closest('.checkbox-parent'));
        $("input:checkbox", $wrap).prop('checked', $(this).prop('checked'));
    });


    var updateCheckboxState = function(){
        $('div.checkbox-parent').each(function(){
            var $parent  = $(this);
            var $trigger = $('.checkbox-trigger', $parent);

            var allChecked = $('.checkbox-wrap input:checked', $parent).length == $('.checkbox-wrap input', $parent).length;
            $trigger.prop('checked', allChecked);

            if($('.checkbox-wrap input:checked', $parent).length && !allChecked){
                $('.checkbox-wrap', $parent).show();
                toggleTrigger($('.subunit-toggle', $parent));
            }

        });
    };
    updateCheckboxState();


    var $wrap = $("#subDept-wrap");
    var $division = $("#user_edit_division");

    if($division.val()){
        $wrap.load($wrap.data('source') + "?division=" + $division.val(), function(){updateCheckboxState();});
    }

    $division.on('change', function(){
        $wrap.load($wrap.data('source') + "?division=" + $division.val(), function(){updateCheckboxState();});
        updateCheckboxState();
    })

});