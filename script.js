(function ( $ ) {
    $.fn.customSelect = function( options ) {
        // Default options
        var settings = $.extend({
            btnPlaceholder: "DropDown",
            MultipleSelectText: "",
            SearchPlaceHolder: "Search",
            AppendLimit: 2,
            DropDownList: [],
            selectedArray: [],
            AppendText: false,
            renderId: $(this).attr("id"),
            parentClass: $(this).attr("id")+'DropdownParentId',
        }, options );

        $('#'+settings.renderId).parent().addClass(settings.parentClass);


        //coverting data into json value
        var selectedList=$(this).html();
        var countList=0;
        var headerText="";
        var DropDownList= settings.DropDownList;
        $(selectedList).each(function() {
            if($(this).html()){
                if($(this).hasClass("tree-level-0")){
                    headerText = $(this).html();
                    var headerValue = $(this).val();
                    var headerClass = $(this).attr('class');
                    var objects  = {
                        "name" : headerText,
                        "value" : headerValue,
                        "className" : headerClass,
                        [headerText]: [],
                    }
                    DropDownList.push(objects);
                    countList=countList+1;
                    if(countList >= 1){
                        countList=0;
                    }
                }
                else {
                    var optionText= $(this).html();
                    var optionVal=$(this).val();
                    var optionClass=$(this).attr('class');
                    $.each(DropDownList, function( index, value ){
                        if(value.name===headerText){
                            var object  = {
                                "name" : optionText,
                                "value" : optionVal,
                                "className": optionClass
                            }
                            DropDownList[index][headerText].push(object);
                        }
                    });
                    settings.DropDownList=DropDownList;

                }
            }
        });

        function createDropdown(data) {
            var inputType= settings.inputType;
            var list="";
            $.each(data, function(key,dataList) {
                var addGroupInput="";
                if(inputType==="checkbox"){
                    addGroupInput='<input class="addGroupInput" value="'+dataList.value+'" type="checkbox" />';
                }
                list=list+'<div class="group-header '+dataList.className+'">'+addGroupInput+'<a class="btn header-label" data-toggle="collapse" data-target="#collapse'+dataList.value+settings.renderId+'" aria-expanded="false" aria-controls="dataTarget'+dataList.value+settings.renderId+'">'+dataList.name+'</a></div><div class="customDropdown-group collapse" id="collapse'+dataList.value+settings.renderId+'" aria-labelledby="#heading'+key+settings.renderId+'">';
                var listItem="";

                $.each(dataList[dataList.name], function(k,list) {
                    listItem=listItem+('<a class="dropdown-item '+list.className+'"><input id="'+inputType+list.value+settings.renderId+'" name="dropdown-input" type="'+inputType+'" value="'+list.value+'"/><label for="'+inputType+list.value+settings.renderId+'">'+list.name+'</label></a>');
                });
                list=list+listItem+('</div>');
            });
            return list;
        }

        // Apply options
        //setting input type
        for (var key in options){
            var customDropdown="";
            parentClass=settings.parentClass;
            //checkbox
            if (key==="inputType") {
                $('.'+parentClass).append('<div class="custom-dropdown-select"><label class="category-label" for="multiselect">'+settings.btnPlaceholder+'</label><span class="multiselect-btn dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" id=""#'+settings.renderId+'DropDownButton"></span><div class="dropdown-menu custom-dropdownmenu"><div class="input-group"><input class="search-input" placeholder="'+settings.SearchPlaceHolder+'"><span class="input-group-addon input-group-addon-btn bg-white"></span></div></div>');
                customDropdown = createDropdown(settings.DropDownList);
            }
            $('.custom-dropdownmenu').append(customDropdown);
        }
        var renderDropdown = ('.'+settings.parentClass+' .custom-dropdownmenu');
        //open Dropdown
        $(renderDropdown).on('click', function() {
            $(renderDropdown).addClass('open');
        });
        $('.'+settings.parentClass+' .custom-dropdown-select .category-label').on('click', function(event) {
            if($(renderDropdown).hasClass('open')){
                $(renderDropdown).removeClass('open');
                $(renderDropdown).removeClass('show');
                event.stopPropagation();
            }
            else{
                $(renderDropdown).addClass('show');
            }
        });

        //close Dropdown
        $(renderDropdown+' .multiselect-btn').on('click', function(event) {
            if($(renderDropdown).hasClass('open')){
                $(renderDropdown).removeClass('open');
                $(renderDropdown).removeClass('show');
                event.stopPropagation();
            }
        });

        //close Dropdown
        $(document).on("click", function(event) {
            if($(renderDropdown) !== event.target && !$(renderDropdown).has(event.target).length) {
                $(renderDropdown).removeClass('open');
                $(renderDropdown).removeClass('show');
            }
        });

        //multi
        $('.'+settings.parentClass+' .custom-dropdownmenu .addGroupInput').on("change", function() {
            var $inputboxes = $(this).parent().next(".customDropdown-group").find("input");
            if ($(this).prop('checked')) {
                $inputboxes.prop('checked', true);
            } else {
                $inputboxes.prop('checked', false);
            }
        });

        $('.'+settings.parentClass+' .custom-dropdownmenu .customDropdown-group input').on("change", function() {
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
        $(renderDropdown+' input').on("change",function() {
            var selectedValue=settings.selectedArray;
            selectedValue=[];
            $.each($(renderDropdown+' .dropdown-item input:checked'), function() {
                selectedValue.push($(this).val());
            });

            //Append text
            if(settings.AppendText) {
                if(selectedValue.length == 0 ) {
                    $('.'+settings.parentClass+' .multiselect-btn').html("");
                }
                else if(selectedValue.length > settings.AppendLimit) {
                    $('.'+settings.parentClass+' .multiselect-btn').text(selectedValue.length+' '+settings.MultipleSelectText);
                }
                else {
                    $('.'+settings.parentClass+' .multiselect-btn').text(selectedValue.join(", "));
                }

                //add class to label
                if(!selectedValue.length == 0) {
                    $('.'+settings.parentClass+' .category-label').addClass('has-value');
                }
                else {
                    $('.'+settings.parentClass+' .category-label').removeClass('has-value');
                }
            }
        });

        return this;
    };
}( jQuery ));

$( document ).ready(function() {
    $('#multiselect').customSelect(
        {
            inputType:"checkbox",
            EmptyText: "EmptyText",
            AppendText: true,
            AppendLimit: 2,
            MultipleSelectText: "Categories",
            SearchPlaceHolder:"search Category",
        });

});
