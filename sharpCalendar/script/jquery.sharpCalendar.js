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
    if (typeof options.doubleDigitsDays    === "undefined") { options.doubleDigitsDays = false; }
	if (typeof options.useWheel            === "undefined") { options.useWheel = true; }
	if (typeof options.callbackDelay       === "undefined") { options.callbackDelay = 500; }
	if (typeof options.vertical            === "undefined") { options.vertical = false; }
	if (typeof options.monthNames          === "undefined") { options.monthNames = (options.vertical ? ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"] : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]); }
	if (typeof options.dayNames            === "undefined") { options.dayNames = (options.vertical ? ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]); }
	if (typeof options.invert              === "undefined") { options.invert = false; }
    if (typeof options.combineMonthYear    === "undefined") { options.combineMonthYear = false; }
    if (typeof options.allowSelectSpans    === "undefined") { options.allowSelectSpans = false; }
    if (typeof options.selectedDatesObj    === "undefined") { options.selectedDatesObj = ''; }
    if (typeof options.animate             === "undefined") { options.animate = false; }
    if (typeof options.sizes               === "undefined") { options.sizes = 'auto'; } // options: auto, equal, none
	// --------------------------  End default option values --------------------------	
    var calendar = { currentDate: options.date },
        sharpCContainer = this.eq(0).addClass("SCBox").addClass("SCTbl"),
        Years  = $("<div>").addClass("SCYear"),
        Months = $("<div>").addClass("SCMonth"),
        Days   = $("<div>").addClass("SCDay");
	
	// -------------------------- Start Initializations -------------------------------
	(function () {
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
        
		if (options.vertical) {
			sharpCContainer.addClass("SCVert");
        } else {
			sharpCContainer.addClass("SCHor");
            
            // TODO: check how this can be avoided
			Years.append($("<div>"));
			Years = Years.find('div');
			Months.append($("<div>"));
			Months = Months.find('div');
            Days.append($("<div>"));
			Days = Days.find('div');
		}
	}());
	// -------------------------- End Initializations --------------------------------
	
	/* Change de focused date of the calendar */
	calendar.changeDate = function (date) {
		calendar.currentDate = date;
        calendar.clicked = calendar.clicked === undefined ? "Day" : calendar.clicked;
	
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
                                    .html("<div>" + htmlI + "</div>");

                    if (d.getFullYear() === calendar.currentDate.getFullYear()) {
                        div.addClass("SCSel");
                    }
                    
                    div.wrap("<div class=\"SCTbl\"/>").wrap("<div/>");
                    
                    if (d.getFullYear() === t.getFullYear()) {
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
                                    .html("<div><span>" + options.monthNames[d.getMonth()] + (options.combineMonthYear ? "'" + d.getFullYear().toString().substring(2, 4) : "") + "</span></div>");

                    if (d.getFullYear() === calendar.currentDate.getFullYear() && d.getMonth() === calendar.currentDate.getMonth()) {
                        div.addClass("SCSel");
                    }
                    console.log(options.selectedDatesObj);
                    if (options.selectedDatesObj !== '' && $('#' + options.selectedDatesObj).val().indexOf(d.getFullYear() + "-" + (d.getMonth() + 1) + "-") >= 0) {
                        div.addClass("SCMarked");
                    }
                        
                    div.wrap("<div class=\"SCTbl\"/>").wrap("<div/>");

                    if (d.getFullYear() === t.getFullYear() && d.getMonth() === t.getMonth()) {
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
                
                if (options.showDayArrows) {
                    d = new Date(date);
                    d.setDate(day - 1);
                    div = $("<div>").addClass("SCElement").attr("millis", d.getTime());
                    div.html("<div class=\"SCDayNum\"></div>");
                    div.wrap("<div class=\"prev\"/>")
                        .wrap("<div/>");
                    Days.append(div.parent().parent());
                }
                
                for (i = -options.days; i <= options.days; i += 1) {
                    d = new Date(date);
                    d.setDate(day + i);
                    div = $("<div>").addClass("SCElement").attr("millis", d.getTime());
                    
                    div.html("<div><div class=\"SCDayNum\">" + (options.doubleDigitsDays ? ("0" + d.getDate()).slice(-2) : d.getDate()) + "</div></div>");
                        
                    if (options.showDayNames) {
                        dayNameHtml = "<div class=\"SCDayName\">" + options.dayNames[d.getDay()] + "</div>";
                        if (options.showDayNamesOnTop) {
                            div.children().first().prepend(dayNameHtml);
                        } else {
                            div.children().first().append(dayNameHtml);
                        }
                    }

                    if (d.getFullYear() === calendar.currentDate.getFullYear() && d.getMonth() === calendar.currentDate.getMonth() && d.getDate() === calendar.currentDate.getDate()) {
                        div.addClass("SCSel");
                    }
                    
                    if (options.selectedDatesObj !== '' && $('#' + options.selectedDatesObj).val().indexOf(d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate()) >= 0) {
                        div.addClass("SCMarked");
                    }

                    div.wrap("<div class=\"SCTbl wd_" + d.getDay() + "\"/>")
                        .wrap("<div/>");

                    if (d.getFullYear() === t.getFullYear() && d.getMonth() === t.getMonth() && d.getDate() === t.getDate()) {
                        div.addClass("SCToday");
                    }
                    
                    Days.append(div.parent().parent());
                }
                
                if (options.showDayArrows) {
                    d = new Date(date);
                    d.setDate(day + 1);
                    div = $("<div>").addClass("SCElement").attr("millis", d.getTime());
                    div.html("<div class=\"SCDayNum\"></div>");
                    div.wrap("<div class=\"next\"/>")
                        .wrap("<div/>");
                    Days.append(div.parent().parent());
                }
            },
            setSizes = function (container, auxH, auxW, marginH, marginV, numCells) {
                var w, ws, h, hs;
                if (options.vertical) {
                    w = ws = container.width() - marginH;
                    h = parseInt((auxH - marginV - numCells * marginV) / numCells, 10);
                    hs = h + auxH - (numCells * h + numCells * marginV);
                    container.find(".prev").width(w + "px");
                    container.find(".next").width(w + "px");
                    container.find(".prev").height(h / 2 + "px");
                    container.find(".next").height(h / 2 + "px");
                } else {
                    h = hs = "100%";
                    w = parseInt((auxW - marginH - numCells * marginH) / numCells, 10);
			        ws = w + auxW - (numCells * w + numCells * marginH);
                    container.find(".prev").width((w / 2) + "px");
                    container.find(".next").width((w / 2) + "px");
                }
                
                container.find(".SCElement>div").width(w + "px");
                container.find(".SCElement>div").height(h + "px");
                if (options.sizes === "auto") {
                    container.find(".SCSel>div").width(ws + "px");
                    container.find(".SCSel>div").height(hs + "px");
                }
                                
            },
            finish = function () {
                var auxH = sharpCContainer.height() === 0 ? sharpCContainer.parent().height() : sharpCContainer.height(),
                    auxW = sharpCContainer.width() === 0 ? sharpCContainer.parent().width() : sharpCContainer.width(),
                    marginH = parseInt(Months.find('.SCTbl').css("margin-left").replace("px", ""), 10) + parseInt(Months.find('.SCTbl').css("margin-right").replace("px", ""), 10),
                    marginV = parseInt(Months.find('.SCTbl').css("margin-top").replace("px", ""), 10) + parseInt(Months.find('.SCTbl').css("margin-bottom").replace("px", ""), 10);
                
                if (options.sizes === "auto" || options.sizes === "equal") {
                    setSizes(Years, auxH, auxW, marginH, marginV, options.prvtYearNumCells);
                    setSizes(Months, auxH, auxW, marginH, marginV, options.prvtMonthNumCells);
                    setSizes(Days, auxH, auxW, marginH, marginV, options.prvtDayNumCells);
                    
                    if (!options.vertical) {
                        Years.find('.SCTbl .SCElement>div').height(Years.find('.SCSel').parent().parent().outerHeight());
                        Months.find('.SCTbl .SCElement>div').height(Months.find('.SCSel').parent().parent().height());
                        Days.find('.SCTbl .SCElement>div').height(Days.find('.SCSel').parent().parent().height());

                        if (options.showDayArrows) {
                            Days.find('.prev .SCElement').height(Days.find('.SCTbl .SCElement').height() + "px");
                            Days.find('.prev .SCElement .SCDayNum').css('line-height', Days.find('.SCTbl .SCElement').height() + "px");
                            Days.find('.next .SCElement').height(Days.find('.SCTbl .SCElement').height() + "px");
                            Days.find('.next .SCElement .SCDayNum').css('line-height', Days.find('.SCTbl .SCElement').height() + "px");
                        }
                    }
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

    function animate(old_d, new_d, time, increment) {
        var aux_d = new Date(calendar.currentDate.getTime());
        if (old_d.getDate() !== new_d.getDate() || old_d.getMonth() !== new_d.getMonth() || old_d.getFullYear() !== new_d.getFullYear()) {
            aux_d.setDate(old_d.getDate() + (old_d > new_d ? -increment : increment));
            increment = Math.abs((aux_d - new_d) / 86400000) > 10 ? 10 : 1;
            calendar.changeDate(aux_d);
            setTimeout(function () {
                animate(aux_d, new_d, time, increment);
            }, time);
        }
    }
    
	sharpCContainer.click(function (ev) {
		var el = $(ev.target).closest(".SCElement"),
            old_d = new Date(calendar.currentDate.getTime()),
            aux_d,
            new_d,
            time;
		if (el.hasClass("SCElement")) {
            $('.SCClicked').removeClass("SCClicked");
            el.addClass('SCClicked');
            if (options.animate && old_d !== undefined) {
                new_d = new Date(parseInt(el.attr("millis"), 10));
                time = 500 / Math.abs((old_d - new_d) / 86400000);
                time = time === 500 ? 0 : time;
                setTimeout(function () {
                    animate(old_d, new_d, time, 1);
                }, time);
            } else {
                calendar.changeDate(new Date(parseInt(el.attr("millis"), 10)));
            }
		}
	});

	//if mousewheel
	if ($.event.special.mousewheel && options.useWheel) {
		Years.mousewheel(function (event, delta) {
			var d = new Date(calendar.currentDate.getTime());
			d.setFullYear(d.getFullYear() + (delta > 0 ? -1 : 1));
			calendar.clicked = "Year";
            calendar.changeDate(d);
			return false;
		});
		Months.mousewheel(function (event, delta) {
			var d = new Date(calendar.currentDate.getTime());
			d.setMonth(d.getMonth() + (delta > 0 ? -1 : 1));
            calendar.clicked = "Month";
			calendar.changeDate(d);
			return false;
		});
		Days.mousewheel(function (event, delta) {
			var d = new Date(calendar.currentDate.getTime());
			d.setDate(d.getDate() + (delta > 0 ? -1 : 1));
            calendar.clicked = "Day";
			calendar.changeDate(d);
			return false;
		});
	}

	calendar.changeDate(options.date);

	return calendar;
};