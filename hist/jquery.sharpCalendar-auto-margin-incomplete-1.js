/*! SharpCalendar - SC - Copyright (c) 2014 José Pedro Marques
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Version: 1.0.0
 * 
 * Requires: 1.2.2+
 */

/*jslint browser: true*/
/*global $, jQuery, alert, console*/
/*eslint wrap-iife: [1, "outside"] */
jQuery.fn.SharpCalendar = jQuery.fn.SC = function (options) {
	'use strict';
    // --------------------------  Start default option values --------------------------
	if (!options.date) { options.date = new Date(); }
    if (typeof options.years               === "undefined") { options.years = 1; }
	if (typeof options.months              === "undefined") { options.months = 3; }
	if (typeof options.days                === "undefined") { options.days = 4; }
	if (typeof options.showDayArrows       === "undefined") { options.showDayArrows = true; }
    if (typeof options.showDayNames        === "undefined") { options.showDayNames = true; }
    if (typeof options.showDayNamesOnTop   === "undefined") { options.showDayNamesOnTop = false; }
	if (typeof options.useWheel            === "undefined") { options.useWheel = true; }
	if (typeof options.callbackDelay       === "undefined") { options.callbackDelay = 500; }
	if (typeof options.vertical            === "undefined") { options.vertical = false; }
	if (typeof options.monthNames          === "undefined") { options.monthNames = (options.vertical ? ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"] : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]); }
	if (typeof options.dayNames            === "undefined") { options.dayNames = (options.vertical ? ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]); }
	if (typeof options.invert              === "undefined") { options.invert = false; }
    if (typeof options.combineMonthYear    === "undefined") { options.combineMonthYear = false; }
    if (typeof options.selectedDates       === "undefined") { options.selectedDates = []; }
	// --------------------------  End default option values --------------------------	
    var calendar = { currentDate: options.date },
        sharpCContainer = this.eq(0).addClass("SCBox").addClass("SCTbl"),
        Years  = $("<div>").addClass("SCYear"),
        Months = $("<div>").addClass("SCMonth"),
        Days   = $("<div>").addClass("SCDay");
	
	// -------------------------- Start Initializations -------------------------------
	(function () {
        var auxH = sharpCContainer.height() === 0 ? sharpCContainer.parent().height() : sharpCContainer.height(),
            auxW = sharpCContainer.width() === 0 ? sharpCContainer.parent().width() : sharpCContainer.width(),
            marginH = 4,
            marginV = 4;
		
        options.prvtYearNumCells = options.years * 2 + 1;
		options.prvtMonthNumCells = options.months * 2 + 1;
		options.prvtDayNumCells = options.days * 2 + 1;
		
		if (options.vertical) {
			sharpCContainer.append($("<div>"));
			sharpCContainer = sharpCContainer.find('div');
		}
		
		if (!options.invert) {
            if (options.combineMonthYear) {
                $('.SCMonth').addClass('Comb');
                sharpCContainer.append(Months).append(Days);
            } else {
                sharpCContainer.append(Years).append(Months).append(Days);
            }
		} else {
            if (options.combineMonthYear) {
                $('.SCMonth').addClass('Comb');
                sharpCContainer.append(Days).append(Months);
            } else {
                sharpCContainer.append(Days).append(Months).append(Years);
            }
	    }
        
		console.log($('.SCMonth .SCTbl').css("margin-left"));
        console.log($('.SCMonth .SCTbl').css("margin-right"));
        console.log($('.SCMonth .SCTbl').css("margin-top"));
        console.log($('.SCMonth .SCTbl').css("margin-bottom"));
		// The calculations for r[h/w] are made so that the width/height of years, months and days is allways the same overall.
		if (options.vertical) {
			sharpCContainer.addClass("SCVert");
			
			// Some extra calculations for the width of the columns in vertical mode
			options.prvtYearWidth  = options.prvtYearSelWidth = Years.width() - marginH + "px";
			options.prvtMonthWidth  = options.prvtMonthSelWidth = Months.width() - marginH + "px";
			options.prvtDayWidth  = options.prvtDaySelWidth = Days.width() - marginH + "px";
			            
			options.prvtYearHeight  = parseInt((auxH - marginV - options.prvtYearNumCells * marginV) / options.prvtYearNumCells, 10);
			options.prvtYearSelHeight = options.prvtYearHeight + auxH - (options.prvtYearNumCells * options.prvtYearHeight + options.prvtYearNumCells * marginV);
            options.prvtMonthHeight  = parseInt((auxH - marginV - options.prvtMonthNumCells * marginV) / options.prvtMonthNumCells, 10);
			options.prvtMonthSelHeight = options.prvtMonthHeight + auxH - (options.prvtMonthNumCells * options.prvtMonthHeight + options.prvtMonthNumCells * marginV);
			options.prvtDayHeight  = parseInt((auxH - marginV - options.prvtDayNumCells * marginV) / options.prvtDayNumCells, 10);
			options.prvtDaySelHeight = options.prvtDayHeight + auxH - (options.prvtDayNumCells * options.prvtDayHeight + options.prvtDayNumCells * marginV);
			
			options.prvtYearHeight += "px";
			options.prvtYearSelHeight += "px";
			options.prvtMonthHeight += "px";
			options.prvtMonthSelHeight += "px";
			options.prvtDayHeight += "px";
			options.prvtDaySelHeight += "px";
		} else {
			sharpCContainer.addClass("SCHor");
			
			options.prvtYearHeight  = options.prvtYearSelHeight = options.prvtMonthHeight  = options.prvtMonthSelHeight = options.prvtDayHeight  = options.prvtDaySelHeight = "100%";
            
			options.prvtYearWidth = parseInt((auxW - marginH - options.prvtYearNumCells * marginH) / options.prvtYearNumCells, 10);
			options.prvtYearSelWidth = options.prvtYearWidth + auxW - (options.prvtYearNumCells * options.prvtYearWidth + options.prvtYearNumCells * marginH);
			options.prvtMonthWidth  = parseInt((auxW - marginH - options.prvtMonthNumCells * marginH) / options.prvtMonthNumCells, 10);
			options.prvtMonthSelWidth = options.prvtMonthWidth + auxW - (options.prvtMonthNumCells * options.prvtMonthWidth + options.prvtMonthNumCells * marginH);
			options.prvtDayWidth  = parseInt((auxW - marginH - options.prvtDayNumCells * marginH) / options.prvtDayNumCells, 10);
			options.prvtDaySelWidth = options.prvtDayWidth + auxW - (options.prvtDayNumCells * options.prvtDayWidth + options.prvtDayNumCells * marginH);
            
			options.prvtYearWidth += "px";
			options.prvtYearSelWidth += "px";
			options.prvtMonthWidth += "px";
			options.prvtMonthSelWidth += "px";
			options.prvtDayWidth += "px";
			options.prvtDaySelWidth += "px";
						
			Years.append($("<div>"));
			Years = Years.find('div');
			Months.append($("<div>"));
			Months = Months.find('div');
		}
	}());
	// -------------------------- End Initializations --------------------------------
	
	/* Change de focused date of the calendar */
	calendar.changeDate = function (date) {
		calendar.currentDate = date;
	
		var fillYears = function (date) {
                var year = date.getFullYear(),
                    t = new Date(),
                    i,
                    d,
                    arrI,
                    sep,
                    htmlI,
                    div;
                Years.empty();

                for (i = year - options.years; i <= year + options.years; i += 1) {
                    d = new Date(date);
                    arrI = i.toString().split("");
                    sep = (options.vertical ? "<br>" : "");
                    htmlI = arrI[0] + sep + arrI[1] + sep + arrI[2] + sep + arrI[3];
                    d.setFullYear(i);
                    div = $("<div>").addClass("SCElement")
                                        .attr("millis", d.getTime())
                                        .html(htmlI);

                    if (d.getYear() === calendar.currentDate.getYear()) {
                        div.addClass("SCSel").wrap("<div class=\"SCTbl\" style=\"width:" + options.prvtYearSelWidth + ";height:" + options.prvtYearSelHeight + ";\"/>").wrap("<div/>");
                    } else {
                        div.wrap("<div class=\"SCTbl\" style=\"width:" + options.prvtYearWidth + ";height:" + options.prvtYearHeight + ";\"/>").wrap("<div/>");
                    }
                    
                    if (d.getYear() === t.getYear()) {
                        div.addClass("SCToday");
                    }

                    Years.append(div.parent().parent());
                }
            },
            fillMonths = function (date) {
                var month = date.getMonth(),
                    t = new Date(),
                    i,
                    d,
                    oldday = date.getDay(),
                    div;
                Months.empty();

                for (i = -options.months; i <= options.months; i += 1) {
                    d = new Date(date);
                    oldday = d.getDate();
                    d.setMonth(month + i);

                    if (d.getDate() !== oldday) {
                        d.setMonth(d.getMonth() - 1);
                        d.setDate(28);
                    }
                    div = $("<div>").addClass("SCElement")
                                        .attr("millis", d.getTime())
                                        .html(options.monthNames[d.getMonth()] + (options.combineMonthYear ? "'" + d.getFullYear().toString().substring(2, 4) : ""));

                    if (d.getYear() === calendar.currentDate.getYear() && d.getMonth() === calendar.currentDate.getMonth()) {
                        div.addClass("SCSel")
                            .wrap("<div class=\"SCTbl\" style=\"width:" + options.prvtMonthSelWidth + ";height:" + options.prvtMonthSelHeight + ";\"/>")
                            .wrap("<div/>");
                    } else {
                        div.wrap("<div class=\"SCTbl\" style=\"width:" + options.prvtMonthWidth + ";height:" + options.prvtMonthHeight + ";\"/>").wrap("<div/>");
                    }

                    if (d.getYear() === t.getYear() && d.getMonth() === t.getMonth()) {
                        div.addClass("SCToday");
                    }
                    
                    Months.append(div.parent().parent());
                }
            },
            fillDays = function (date) {
                var day = date.getDate(),
                    t = new Date(),
                    d,
                    i,
                    dayNameHtml,
                    div;
                Days.empty();
                for (i = -options.days; i <= options.days; i += 1) {
                    d = new Date(date);
                    d.setDate(day + i);
                    div = $("<div>").addClass("SCElement").attr("millis", d.getTime());
                                        
//                    if (i === -options.days && options.showDayArrows) {
//                        div.wrap("<div class=\"SCTbl prev\" style=\"width:" + options.prvtDayWidth + ";height:" + options.prvtDayHeight + ";\"/>")
//                            .wrap("<div/>")
//                            .css("width", options.prvtDayWidth)
//                            .css("height", options.prvtDayHeight - 2);
//                    } else if (i === options.days && options.showDayArrows) {
//                        div.wrap("<div class=\"SCTbl next\" style=\"width:" + options.prvtDayWidth + ";height:" + options.prvtDayHeight + ";\"/>")
//                            .wrap("<div/>")
//                            .css("width", options.prvtDayWidth)
//                            .css("height", options.prvtDayHeight - 2);
//                    } else {
                    div.html("<div class=\"SCDayNum\">" + d.getDate() + "</div>");
                        
                    if (options.showDayNames) {
                        dayNameHtml = "<div class=\"SCDayName\">" + options.dayNames[d.getDay()] + "</div>";
                        if (options.showDayNamesOnTop) {
                            div.prepend(dayNameHtml);
                        } else {
                            div.append(dayNameHtml);
                        }
                    }

                    if (d.getYear() === calendar.currentDate.getYear() && d.getMonth() === calendar.currentDate.getMonth() && d.getDate() === calendar.currentDate.getDate()) {
                        div.addClass("SCSel")
                            .wrap("<div class=\"SCTbl day_" + d.getDay() + "\" style=\"width:" + options.prvtDaySelWidth + ";height:" + options.prvtDaySelHeight + ";\"/>")
                            .wrap("<div/>")
                            .css("width", options.prvtDaySelWidth)
                            .css("height", options.prvtDaySelHeight - 2);
                    } else {
                        div.wrap("<div class=\"SCTbl\" style=\"width:" + options.prvtDayWidth + ";height:" + options.prvtDayHeight + ";\"/>")
                            .wrap("<div/>")
                            .css("width", options.prvtDayWidth)
                            .css("height", options.prvtDayHeight - 2);
                    }

                    if (d.getYear() === t.getYear() && d.getMonth() === t.getMonth() && d.getDate() === t.getDate()) {
                        div.addClass("SCToday");
                    }
//                    }
                    
                    Days.append(div.parent().parent());
                }
            },
            finish = function () {
                if (!options.vertical) {
                    Years.find('.SCTbl .SCElement').height(Years.find('.SCSel').parent().parent().outerHeight());
                    Months.find('.SCTbl .SCElement').height(Months.find('.SCSel').parent().parent().height());
                    Days.find('.SCTbl .SCElement').height(Days.find('.SCSel').parent().parent().height());
                }
            },
            deferredCallBack = function () {
                if (typeof options.callback === "function") {
                    if (calendar.timer) {
                        clearTimeout(calendar.timer);
                    }
                    calendar.timer = setTimeout(function () {
                        options.callback(calendar);
                    }, options.callbackDelay);
                }
            };
        
        if (!options.combineMonthYear) {
            fillYears(date);
        }
		fillMonths(date);
		fillDays(date);
        finish();
        
		deferredCallBack();
	};

	sharpCContainer.click(function (ev) {
		var el = $(ev.target).closest(".SCElement");
		if (el.hasClass("SCElement")) {
			calendar.changeDate(new Date(parseInt(el.attr("millis"), 10)));
		}
	});

	//if mousewheel
	if ($.event.special.mousewheel && options.useWheel) {
		Years.mousewheel(function (event, delta) {
			var d = new Date(calendar.currentDate.getTime());
			d.setFullYear(d.getFullYear() - (delta > 0 ? 1 : -1));
			calendar.changeDate(d);
			return false;
		});
		Months.mousewheel(function (event, delta) {
			var d = new Date(calendar.currentDate.getTime());
			d.setMonth(d.getMonth() - (delta > 0 ? 1 : -1));
			calendar.changeDate(d);
			return false;
		});
		Days.mousewheel(function (event, delta) {
			var d = new Date(calendar.currentDate.getTime());
			d.setDate(d.getDate() - (delta > 0 ? 1 : -1));
			calendar.changeDate(d);
			return false;
		});
	}

	calendar.changeDate(options.date);

	return calendar;
};