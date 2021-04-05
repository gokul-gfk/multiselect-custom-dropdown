(function ( $ ) {
    $.fn.customSelect = function( options ) {
      // Default options
      var settings = $.extend({
        renderId: "multiselect",
        DropDownList:[],
        inputType: "checkbox",
        btnPlaceholder: "DropDown",
        SearchPlaceHolder:"Search",
        AppendText: true,
        AppendLimit: 2,
        MultipleSelectText: "selected",
      }, options );
      
      function createDropdown(data) {
        var inputType= settings.inputType;
        var list="";
        
        $.each(data, function(key,dataList) { 
          var addGroupInput="";
          if(inputType==="checkbox"){
            addGroupInput='<input class="addGroupInput" value="'+dataList.value+'" type="checkbox" />';
          }
          list=list+'<div class="group-header '+dataList.className+'">'+addGroupInput+'<a class="btn header-label" data-toggle="collapse" data-target="#collapse'+dataList.value+settings.renderId+'" aria-expanded="false" aria-controls="dataTarget'+dataList.value+settings.renderId+'">'+dataList.name+'</a></div><div class="customDropdown-group collapse show" id="collapse'+dataList.value+settings.renderId+'" aria-labelledby="#heading'+key+settings.renderId+'">';
          var listItem="";
          $.each(dataList[dataList.name], function(k,list) { 
          console.log(list);
            listItem=listItem+('<a class="dropdown-item '+list.className+'"><input id="'+inputType+list.value+settings.renderId+'" name="dropdown-input" type="'+inputType+'" value="'+list.value+'"/><label for="'+inputType+list.value+settings.renderId+'">'+list.name+'</label></a>');
          });
          list=list+listItem+('</div>');
        });
         return list;
      }
      
      for (var key in options){
        var customDropdown="";
        if (key==="DropDownList") {
          $('#'+settings.renderId).append('<label class="category-label" for="multiselect">'+settings.btnPlaceholder+'</label><button type="button" class="multiselect-btn btn dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" id=""#'+settings.renderId+'DropDownButton"></button><div class="dropdown-menu custom-dropdownmenu"><div class="input-group"><input class="search-input" placeholder="'+settings.SearchPlaceHolder+'"><span class="input-group-addon input-group-addon-btn bg-white"></span></div></div>');
          var customDropdownList=settings.DropDownList;
          customDropdown = createDropdown(customDropdownList);
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
  //coverting data into json value
    var countList=0;
    var DropDownList=[];
    var currentName="";
    $("#cd1 option").each(function() {
      if($(this).hasClass("tree-level-0")){  
        currentName = $(this).html();
        var object  = {
          "name" : currentName,
          "value" : $(this).val(),
          "className" : $(this).attr('class'),
          [currentName]:[]
        }
        DropDownList.push(object);
        countList=countList+1;
        if(countList >= 1){
          countList=0;
        } 
      }
      else {
        var curOpion= $(this).html();
        var curVal=$(this).val();
        var curClass=$(this).attr('class');
        $.each(DropDownList, function( index, value ){
          if(value.name===currentName){
            var object  = {
              "name" : curOpion,
              "value" : curVal,
              "className": curClass
            }
            DropDownList[index].[value.name].push(object);
          }
        });        
      }
    });
    $('#multiselect').customSelect(
      {
        renderId: "multiselect",
        DropDownList: DropDownList,
        SearchPlaceHolder: "search Category",
        inputType: "checkbox",
    });
});
