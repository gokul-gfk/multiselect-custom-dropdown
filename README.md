# multiselect-custom-dropdown
You can view a live demo [Here](https://gokul-gfk.github.io/multiselect-custom-dropdown/)


created using Bootstrap and jquery


It contains dropdown group with Accordion(collapse).
has two types of input
  * checkbox
  * radio
with filter option by group or child directly

## Via JavaScript
```
  //for checkbox button options
  $('#multiselect').customSelect({
        inputType:"checkbox",
        AppendText: true,
        btnLabel:"checkboxFilter",
        AppendLimit: 2,
        AppendLimitText: "Categories",        
        SearchPlaceHolder:"Search Categories",
        closeIcon: true,
        DropDownList: DropDownList,
        onSelectFunction: function (a) {},
    });
    
    //for Radio button options
    $('#multiselect1').customSelect({
        btnLabel:"radioFilter",
        inputType:"radio",
        AppendText: true,
        SearchPlaceHolder:"Search Categories",
        closeIcon: true,
        DropDownList: DropDownList1,
    });
});
```

## Options
 - btnLabel 
 - AppendLimitText
 - SearchPlaceHolder 
 - AppendLimit 
 - DropDownListselectedArray 
 - AppendText 
 - closeIcon
 - onSelectFunction
