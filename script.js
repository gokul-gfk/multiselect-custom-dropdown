(function($) {
	$.fn.customSelect = function(options) {
		// Default options
		var settings = $.extend({
			btnLabel: "DropDown",
			AppendLimitText: "selected",
			SearchPlaceHolder: "Search",
			AppendLimit: 2,
			DropDownList: [],
			selectedArray: [],
			AppendText: false,
			renderId: $(this).attr("id"),
			parentClass: $(this).attr("id") + 'DropdownParentId',
			closeIcon: false,
			onSelectFunction: function(selectedValue) {
				return selectedValue
			}, //callback function for when selected array changes
		}, options);

		$('#' + settings.renderId).wrap('<div class="' + settings.parentClass + '"></div>');
		$('#' + settings.renderId).hide();

		//create dropdown
		function createDropdown(data) {
			var inputType = settings.inputType;
			var list = "";
			$.each(data, function(key, dataList) {
				var addGroupInput = "";
				if (inputType === "checkbox") {
					addGroupInput = '<input class="addGroupInput" value="' + dataList.value + '" type="checkbox" />';
				}
				list = list + '<div class="group-header ' + dataList.className + '">' + addGroupInput + '<a class="btn header-label collapsed" data-toggle="collapse" data-target="#collapse' + dataList.value + settings.renderId + '" aria-expanded="false" aria-controls="dataTarget' + dataList.value + settings.renderId + '">' + dataList.name + '</a></div><div class="customDropdown-group collapse" id="collapse' + dataList.value + settings.renderId + '" aria-labelledby="#heading' + key + settings.renderId + '">';
				var listItem = "";
				$.each(dataList[dataList.name], function(k, list) {
					listItem = listItem + ('<a class="dropdown-item ' + list.className + '"><input id="' + inputType + list.value + settings.renderId + '" name="dropdown-input" type="' + inputType + '" value="' + list.value + '" /><label for="' + inputType + list.value + settings.renderId + '">' + list.name + '</label></a>');
				});
				list = list + listItem + ('</div>');
			});
			return list;
		}

		// Apply options
		for (var key in options) {
			var customDropdown = "";
			parentClass = settings.parentClass;
			if (key === "DropDownList") {
				$('.' + parentClass).append('<div class="custom-dropdown-select"><label class="category-label" for="multiselect">' + settings.btnLabel + '</label><span class="multiselect-btn dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" id="' + settings.renderId + 'DropDownButton"></span><div class="dropdown-menu custom-dropdownmenu"><div class="input-group"><input type="search" id="' + settings.renderId + 'search" class="search-input" placeholder="' + settings.SearchPlaceHolder + '" /><span class="input-group-addon input-group-addon-btn bg-white"></span></div><div class="collapseContent"></div></div>');
				customDropdown = createDropdown(settings.DropDownList);
			}
			$('.' + parentClass + ' .custom-dropdownmenu .collapseContent').append(customDropdown);
		}

		var renderDropdown = ('.' + settings.parentClass + ' .custom-dropdownmenu');

		//open first collapse
		$('.collapseContent').each(function(index) {
			$(this).find(".customDropdown-group:first").addClass('show');
			$(this).find('.group-header:first .header-label').removeClass('collapsed');
		});

		//open Dropdown
		$(renderDropdown).on('click', function() {
			$(renderDropdown).addClass('open');
		});
		$('.' + settings.parentClass + ' .custom-dropdown-select .category-label').on('click', function(event) {
			if ($(renderDropdown).hasClass('open')) {
				$(renderDropdown).removeClass('open');
				$(renderDropdown).removeClass('show');
				event.stopPropagation();
			} else {
				$(renderDropdown).addClass('open');
				$(renderDropdown).addClass('show');
				event.stopPropagation();
			}
		});

		//close Dropdown
		$(renderDropdown + ' .multiselect-btn').on('click', function(event) {
			if ($(renderDropdown).hasClass('open')) {
				$(renderDropdown).removeClass('open');
				$(renderDropdown).removeClass('show');
				event.stopPropagation();
			}
		});
		$(document).on("click", function(event) {
			if ((!$(event.target).closest(renderDropdown).length) && ($(renderDropdown).hasClass('open') || $(renderDropdown).hasClass('show'))) {
				$(renderDropdown).removeClass('open');
				$(renderDropdown).removeClass('show');
			}
		});

		//multi
		$('.' + settings.parentClass + ' .custom-dropdownmenu .addGroupInput').on("change", function() {
			var $inputboxes = $(this).parent().next(".customDropdown-group").find("input");
			if ($(this).prop('checked')) {
				$inputboxes.prop('checked', true);
				$inputboxes.parent().addClass('checkedList');
			} else {
				$inputboxes.prop('checked', false);
				$inputboxes.parent().removeClass('checkedList');
			}
		});
		$('.' + settings.parentClass + ' .custom-dropdownmenu .customDropdown-group input').on("change", function() {
			var $outerdiv = $(this).parent().parent();
			var $inputbox = $outerdiv.find("input");
			var $checkboxesTotal = $inputbox.length;
			var countCheckedCheckboxes = $inputbox.filter(':checked').length;
			if (countCheckedCheckboxes === $checkboxesTotal) {
				$outerdiv.prev().find("input").prop('checked', true);
			} else {
				$outerdiv.prev().find("input").prop('checked', false);
			}
		});

		//search option
		$('#' + settings.renderId + 'search').keyup(function(e) {
			var searchText = $(this).val().toLowerCase();
			list = $(this).parent().parent().find(".collapseContent .dropdown-item");
			headerList = $(this).parent().parent().find(".collapseContent .header-label");
			if (searchText !== "") {
				headerList.each(function(i, obj) {
					var headerName = $(this).text().toLowerCase();
					if (headerName.indexOf(searchText) > -1) {
						$(this).parent().show();
						$(this).parent().next().find(".dropdown-item").each(function(i, j) {
							$(this).show();
						})
					} else {
						$(this).parent().hide();
					}
				});
				list.each(function(i, obj) {
					var dataName = $(this).find('label').text().toLowerCase();
					if (dataName.indexOf(searchText) > -1) {
						$(this).show();
						$(this).parent().prev().show();
					} else {
						$(this).hide();
					}
				});
				headerList.each(function(i, obj) {
					var headerName = $(this).text().toLowerCase();
					if (headerName.indexOf(searchText) > -1) {
						$(this).parent().show();
						$(this).parent().find("input").show();
						$(this).parent().next().find(".dropdown-item").each(function(i, j) {
							$(this).show();
						})
					} else {
						$(this).parent().find("input").hide();
					}
				});
			} else {
				list.each(function(i, obj) {
					$(this).show();
				});
				headerList.each(function(i, obj) {
					$(this).parent().show();
					$(this).parent().find("input").show();
				});
			}
			e.stopPropagation();
		});

        //close Icon remove
		function removeSelected() {
			$('.select-close-icon').on("click", function(event) {
				var removeVal = $(this).attr('title');
				$(renderDropdown + ' .dropdown-item input[value=' + removeVal + ']').prop('checked', false);
				$(renderDropdown + ' .dropdown-item input[value=' + removeVal + ']').parent().removeClass('checkedList');
				selectedValue = [];
				createArray(selectedValue);
				textAppend(selectedValue);
				event.stopPropagation();
			});
		}

		//creating array
		function createArray(selectedValue) {
			var selectedArray = [];
			var SelectedArrayName = [];
			$.each($(renderDropdown + ' .dropdown-item input:checked'), function() {
				var text = $(this).next('label').text();
				var value = $(this).val();
				var customAppend = ('<span class="append-text"><span class="appendText" value="' + value + '">' + text + '</span><button class="select-close-icon" title="' + value + '"><span>X</span></button></span>');
				selectedArray.push(value);
				SelectedArrayName.push(text);
				if (settings.closeIcon) {
					selectedValue.push(customAppend);
				} else {
					selectedValue.push(text);
				}
			});
			$('#' + settings.renderId).val(selectedArray);
			callOnSelectChange(SelectedArrayName);
			return selectedValue;
		}

		function textAppend(data) {
			if (data.length == 0) {
				$('.' + settings.parentClass + ' .multiselect-btn').html("");
			} else if (data.length > settings.AppendLimit) {
				$('.' + settings.parentClass + ' .multiselect-btn').html('<span class="append-text">' + data.length + ' ' + settings.AppendLimitText + '</span>');
			} else {
				$('.' + settings.parentClass + ' .multiselect-btn').html(data);
				removeSelected();//remove selected
			}
			//add class to label
			if (!data.length == 0) {
				$('.' + settings.parentClass + ' .category-label').addClass('has-value');
			} else {
				$('.' + settings.parentClass + ' .category-label').removeClass('has-value');
			}
			return data;
		}

		//on change input
		$(renderDropdown + ' .collapseContent input').on("change", function() {
			var selectedValue = settings.selectedArray;
			selectedValue = [];
			createArray(selectedValue);
			//Append text
			if (settings.AppendText) {
				textAppend(selectedValue);
			}
		});

		//on add class while input checked
		$(renderDropdown + ' .dropdown-item input').on("change", function() {
			$.each($(renderDropdown + ' .dropdown-item'), function() {
				if ($(this).find('input').is(":checked")) {
					$(this).addClass('checkedList');
				} else {
					$(this).removeClass('checkedList');
				}
			});
		});

		//method to get selectedArray value
		function callOnSelectChange(selectedValue) {
			settings.onSelectFunction(selectedValue);
		}

		return this;
	};
}(jQuery));

$(document).ready(function() {

	//coverting data into json value
	var selectedList = $('#multiselect').html();
	var countList = 0;
	var headerText = "";
	var DropDownList = [];
	$(selectedList).each(function() {
		if ($(this).html()) {
			if ($(this).hasClass("tree-level-0")) {
				headerText = $(this).html();
				var headerValue = $(this).val();
				var headerClass = $(this).attr('class');
				var objects = {
					"name": headerText,
					"value": headerValue,
					"className": headerClass,
					[headerText]: [],
				}
				DropDownList.push(objects);
				countList = countList + 1;
				if (countList >= 1) {
					countList = 0;
				}
			} else {
				var optionText = $(this).html();
				var optionVal = $(this).val();
				var optionClass = $(this).attr('class');
				$.each(DropDownList, function(index, value) {
					if (value.name === headerText) {
						var object = {
							"name": optionText,
							"value": optionVal,
							"className": optionClass
						}
						DropDownList[index][headerText].push(object);
					}
				});
			}
		}
	});

	//coverting data into json value 2
	var selectedList = $('#multiselect1').html();
	var countList = 0;
	var headerText = "";
	var DropDownList1 = [];
	$(selectedList).each(function() {
		if ($(this).html()) {
			if ($(this).hasClass("tree-level-0")) {
				headerText = $(this).html();
				var headerValue = $(this).val();
				var headerClass = $(this).attr('class');
				var objects = {
					"name": headerText,
					"value": headerValue,
					"className": headerClass,
					[headerText]: [],
				}
				DropDownList1.push(objects);
				countList = countList + 1;
				if (countList >= 1) {
					countList = 0;
				}
			} else {
				var optionText = $(this).html();
				var optionVal = $(this).val();
				var optionClass = $(this).attr('class');
				$.each(DropDownList1, function(index, value) {
					if (value.name === headerText) {
						var object = {
							"name": optionText,
							"value": optionVal,
							"className": optionClass
						}
						DropDownList1[index][headerText].push(object);
					}
				});
			}
		}
	});



	/// USER SIDE
	var multiselectPlugin = $('#multiselect').customSelect({
		inputType: "checkbox",
		AppendText: true,
		btnLabel: "checkboxFilter",
		AppendLimit: 2,
		AppendLimitText: "Categories",
		SearchPlaceHolder: "Search Categories",
		closeIcon: true,
		DropDownList: DropDownList,
		onSelectFunction: function(selectedList) {
			console.log(selectedList)
		},
	});
	$('#multiselect1').customSelect({
		btnLabel: "radioFilter",
		inputType: "radio",
		AppendText: true,
		SearchPlaceHolder: "Search Categories",
		closeIcon: true,
		DropDownList: DropDownList1,
	});
});
