(function ( $ ) {
    $.fn.customSelect = function( options ) {
        // Default options
        var settings = $.extend({
            btnPlaceholder: "DropDown",
            MultipleSelectText: "",
            SearchPlaceHolder: "Search",
            AppendLimit: 2,
            radioboxList: [],
            checkboxList: [],
            selectedArray: [],
            AppendText: false,
            renderId: "multiselect"
        }, options );

        //create dropdown
        function createDropdown(data,inputType) {
            var list="";
            $.each(data, function(key,value) {
                var addGroupInput="";
                if(inputType==="checkbox"){
                    addGroupInput='<input class="addGroupInput" type="checkbox" />';
                }

                list=list+'<div class="group-header">'+addGroupInput+'<a class="btn header-label" data-toggle="collapse" data-target="#collapse'+key+settings.renderId+'" aria-expanded="false" aria-controls="dataTarget'+key+settings.renderId+'">'+key+'</a></div><div class="customDropdown-group collapse show" id="collapse'+key+settings.renderId+'" aria-labelledby="#heading'+key+settings.renderId+'">';
                var listItem="";
                $.each(value, function(k,list) {
                    listItem=listItem+('<a class="dropdown-item"><input id="'+inputType+list+settings.renderId+'" name="dropdown-input" type="'+inputType+'" value="'+list+'"/><label for="'+inputType+list+settings.renderId+'">'+list+'</label></a>');
                });
                list=list+listItem+('</div>');
            });
            return list;
        }

        // Apply options
        //setting input type
        for (var key in options){
            var customDropdown="";
            //checkbox
            if (key==="checkboxList") {
                $('#'+settings.renderId).append('<label class="category-label" for="multiselect">'+settings.btnPlaceholder+'</label><button type="button" class="multiselect-btn btn dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" id=""#'+settings.renderId+'DropDownButton"></button><div class="dropdown-menu custom-dropdownmenu"><div class="input-group"><input class="search-input" placeholder="'+settings.SearchPlaceHolder+'"><span class="input-group-addon input-group-addon-btn bg-white"></span></div></div>');
                var customCheckList=settings.checkboxList;
                customDropdown = createDropdown(customCheckList,'checkbox');
            }

            //radiobox
            if (key==="radioboxList") {
                $('#'+settings.renderId).append('<label class="category-label" for="multiselect">'+settings.btnPlaceholder+'</label><button type="button" class="multiselect-btn btn dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" id="#'+settings.renderId+'DropDownButton"></button><div class="dropdown-menu custom-dropdownmenu"><div class="input-group"><input class="search-input" placeholder="'+settings.SearchPlaceHolder+'"><span class="input-group-addon input-group-addon-btn bg-white"></span></div><div>');
                var customRadioBoxList=settings.radioboxList;
                customDropdown = createDropdown(customRadioBoxList,'radio');
            }
            $('#'+settings.renderId+' .dropdown-menu').append(customDropdown);
        }

        var $renderDropdown = $('#'+settings.renderId+' .dropdown-menu');

        //open Dropdown
        $renderDropdown.on('click', function() {
            $renderDropdown.addClass('open');
        });
        $('#'+settings.renderId+' .category-label').on('click', function(event) {
            if($renderDropdown.hasClass('open')){
                $renderDropdown.removeClass('open');
                $renderDropdown.removeClass('show');
                event.stopPropagation();
            }
            else{
                $renderDropdown.addClass('open');
                event.stopPropagation();
            }
        });

        //close Dropdown
        $('#'+settings.renderId+' .multiselect-btn').on('click', function(event) {
            if($renderDropdown.hasClass('open')){
                $renderDropdown.removeClass('open');
                $renderDropdown.removeClass('show');
                event.stopPropagation();
            }
        });

        //close Dropdown
        $(document).on("click", function(event) {
            if($renderDropdown !== event.target && !$renderDropdown.has(event.target).length) {
                $renderDropdown.removeClass('open');
                $renderDropdown.removeClass('show');
            }
        });

        //multi
        $('#'+settings.renderId+' .addGroupInput').on("change", function() {
            var $inputboxes = $(this).parent().next(".customDropdown-group").find("input");
            if ($(this).prop('checked')) {
                $inputboxes.prop('checked', true);
            } else {
                $inputboxes.prop('checked', false);
            }
        });

        $('#'+settings.renderId+' .customDropdown-group input').on("change", function() {
            var $outerdiv = $(this).parent().parent();
            var $inputbox = $outerdiv.find("input");
            var $checkboxesTotal = $inputbox.length;
            var countCheckedCheckboxes = $inputbox.filter(':checked').length;
            if(countCheckedCheckboxes===$checkboxesTotal) {
                $outerdiv.prev().find("input").prop('checked', true);
            }
            else {
                $outerdiv.prev().find("input").prop('checked', false);
            }
        });

        //get checked value
        $('#'+settings.renderId+' input').on("change",function() {
            var selectedValue=settings.selectedArray;
            selectedValue=[];
            $.each($('#'+settings.renderId+' .dropdown-item input:checked'), function() {
                selectedValue.push($(this).val());
            });

            //Append text
            if(settings.AppendText) {
                if(selectedValue.length == 0 ) {
                    $('#'+settings.renderId+' .multiselect-btn').html("");
                }
                else if(selectedValue.length > settings.AppendLimit) {
                    $('#'+settings.renderId+' .multiselect-btn').text(selectedValue.length+' '+settings.MultipleSelectText);
                }
                else {
                    $('#'+settings.renderId+' .multiselect-btn').text(selectedValue.join(", "));
                }

                //add class to label
                if(!selectedValue.length == 0) {
                    $('#'+settings.renderId+' .category-label').addClass('has-value');
                }
                else {
                    $('#'+settings.renderId+' .category-label').removeClass('has-value');
                }
            }
        });

        return this;
    };
}( jQuery ));

$( document ).ready(function() {
    $('#multiselect').customSelect(
        {
            renderId: "multiselect",
            checkboxList: {
                Letter: ['A','B','C',['d','e']],
                Number: ['1','2','3','4'],
            },
            EmptyText: "EmptyText",
            AppendText: true,
            AppendLimit: 5,
            MultipleSelectText: "Categories",
            SearchPlaceHolder:"search Category",
        });
    $('#muti1').customSelect(
        {
            renderId: "muti1",
            radioboxList: {
                Letter: ['A','B','C','D'],
                Number: ['1','2','3','4']
            },
            AppendText: true,
        });
});
