
/**
 * Bind autocomplete to HTML that is reloaded
 */
var bindAutocompletes = function(){
    /** Autocomplete for course leader **/
    $(".ox-autocomplete").each(function(i, el){
        var $el     = $(el);
        var $elText = $('#' + $el.attr('id') + "_autocomplete");

        var dataSource = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace('text'),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            remote: $el.data('source') + '?q=%QUERY'
        });
        dataSource.initialize();

        $elText.typeahead({
            hint: false,
            highlight: true
        },{
            name: 'default',
            displayKey: 'text',
            source: dataSource.ttAdapter()
        }).on('typeahead:selected', function(e, obj){
            $el.val(obj.id);
        }).on('typeahead:autocompleted', function(e, obj){
            $el.val(obj.id);
        }).on('keyup', function(){
            if($elText.val() == ''){
                $el.val('');
            }
        })

    });
}


$(document).ready(function(){

    $('[data-toggle="showhide"]').on('click', function(){
       var target = $(this).attr('data-target');
       if($(target).hasClass('hide')){
           $(target).removeClass('hide');
       }else{
           $(target).toggle();
       }
    });


    $('input.datepicker').datepicker({
      format: 'dd/mm/yyyy'
    });

    $("[data-toggle=tooltip]").tooltip();

    $("input, textarea").placeholder();
});