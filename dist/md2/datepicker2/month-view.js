var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, Optional, Output, ViewEncapsulation } from '@angular/core';
import { MdCalendarCell } from './calendar-body';
import { DateAdapter } from './date-adapter';
import { createMissingDateImplError } from './datepicker-errors';
import { MD_DATE_FORMATS } from './date-formats';
var DAYS_PER_WEEK = 7;
/**
 * An internal component used to display a single month in the datepicker.
 * @docs-private
 */
var MdMonthView = (function () {
    function MdMonthView(_dateAdapter, _dateFormats) {
        this._dateAdapter = _dateAdapter;
        this._dateFormats = _dateFormats;
        /** Emits when a new date is selected. */
        this.selectedChange = new EventEmitter();
        if (!this._dateAdapter) {
            throw createMissingDateImplError('DateAdapter');
        }
        if (!this._dateFormats) {
            throw createMissingDateImplError('MD_DATE_FORMATS');
        }
        var firstDayOfWeek = this._dateAdapter.getFirstDayOfWeek();
        var narrowWeekdays = this._dateAdapter.getDayOfWeekNames('narrow');
        var longWeekdays = this._dateAdapter.getDayOfWeekNames('long');
        // Rotate the labels for days of the week based on the configured first day of the week.
        var weekdays = longWeekdays.map(function (long, i) {
            return { long: long, narrow: narrowWeekdays[i] };
        });
        this._weekdays = weekdays.slice(firstDayOfWeek).concat(weekdays.slice(0, firstDayOfWeek));
        this._activeDate = this._dateAdapter.today();
    }
    Object.defineProperty(MdMonthView.prototype, "activeDate", {
        /**
         * The date to display in this month view (everything other than the month and year is ignored).
         */
        get: function () { return this._activeDate; },
        set: function (value) {
            var oldActiveDate = this._activeDate;
            this._activeDate = value || this._dateAdapter.today();
            if (!this._hasSameMonthAndYear(oldActiveDate, this._activeDate)) {
                this._init();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdMonthView.prototype, "selected", {
        /** The currently selected date. */
        get: function () { return this._selected; },
        set: function (value) {
            this._selected = value;
            this._selectedDate = this._getDateInCurrentMonth(this.selected);
        },
        enumerable: true,
        configurable: true
    });
    MdMonthView.prototype.ngAfterContentInit = function () {
        this._init();
    };
    /** Handles when a new date is selected. */
    MdMonthView.prototype._dateSelected = function (date) {
        if (this._selectedDate == date) {
            return;
        }
        this.selectedChange.emit(this._dateAdapter.createDate(this._dateAdapter.getYear(this.activeDate), this._dateAdapter.getMonth(this.activeDate), date));
    };
    /** Initializes this month view. */
    MdMonthView.prototype._init = function () {
        this._selectedDate = this._getDateInCurrentMonth(this.selected);
        this._todayDate = this._getDateInCurrentMonth(this._dateAdapter.today());
        this._monthLabel =
            this._dateAdapter.getMonthNames('short')[this._dateAdapter.getMonth(this.activeDate)]
                .toLocaleUpperCase();
        var firstOfMonth = this._dateAdapter.createDate(this._dateAdapter.getYear(this.activeDate), this._dateAdapter.getMonth(this.activeDate), 1);
        this._firstWeekOffset =
            (DAYS_PER_WEEK + this._dateAdapter.getDayOfWeek(firstOfMonth) -
                this._dateAdapter.getFirstDayOfWeek()) % DAYS_PER_WEEK;
        this._createWeekCells();
    };
    /** Creates MdCalendarCells for the dates in this month. */
    MdMonthView.prototype._createWeekCells = function () {
        var daysInMonth = this._dateAdapter.getNumDaysInMonth(this.activeDate);
        var dateNames = this._dateAdapter.getDateNames();
        this._weeks = [[]];
        for (var i = 0, cell = this._firstWeekOffset; i < daysInMonth; i++, cell++) {
            if (cell == DAYS_PER_WEEK) {
                this._weeks.push([]);
                cell = 0;
            }
            var date = this._dateAdapter.createDate(this._dateAdapter.getYear(this.activeDate), this._dateAdapter.getMonth(this.activeDate), i + 1);
            var enabled = !this.dateFilter ||
                this.dateFilter(date);
            var ariaLabel = this._dateAdapter.format(date, this._dateFormats.display.dateA11yLabel);
            this._weeks[this._weeks.length - 1]
                .push(new MdCalendarCell(i + 1, dateNames[i], ariaLabel, enabled));
        }
    };
    /**
     * Gets the date in this month that the given Date falls on.
     * Returns null if the given Date is in another month.
     */
    MdMonthView.prototype._getDateInCurrentMonth = function (date) {
        return this._hasSameMonthAndYear(date, this.activeDate) ?
            this._dateAdapter.getDate(date) : null;
    };
    /** Checks whether the 2 dates are non-null and fall within the same month of the same year. */
    MdMonthView.prototype._hasSameMonthAndYear = function (d1, d2) {
        return !!(d1 && d2 && this._dateAdapter.getMonth(d1) == this._dateAdapter.getMonth(d2) &&
            this._dateAdapter.getYear(d1) == this._dateAdapter.getYear(d2));
    };
    return MdMonthView;
}());
__decorate([
    Input(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], MdMonthView.prototype, "activeDate", null);
__decorate([
    Input(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], MdMonthView.prototype, "selected", null);
__decorate([
    Input(),
    __metadata("design:type", Function)
], MdMonthView.prototype, "dateFilter", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], MdMonthView.prototype, "selectedChange", void 0);
MdMonthView = __decorate([
    Component({selector: 'md2-month-view',
        template: "<table class=\"md2-calendar-table\"><thead class=\"md2-calendar-table-header\"><tr><th *ngFor=\"let day of _weekdays\" [attr.aria-label]=\"day.long\">{{day.narrow}}</th></tr><tr><th class=\"md2-calendar-table-header-divider\" colspan=\"7\" aria-hidden=\"true\"></th></tr></thead><tbody md2-calendar-body role=\"grid\" [label]=\"_monthLabel\" [rows]=\"_weeks\" [todayValue]=\"_todayDate\" [selectedValue]=\"_selectedDate\" [labelMinRequiredCells]=\"3\" [activeCell]=\"_dateAdapter.getDate(activeDate) - 1\" (selectedValueChange)=\"_dateSelected($event)\"></tbody></table>",
        encapsulation: ViewEncapsulation.None,
        changeDetection: ChangeDetectionStrategy.OnPush,
    }),
    __param(0, Optional()),
    __param(1, Optional()), __param(1, Inject(MD_DATE_FORMATS)),
    __metadata("design:paramtypes", [DateAdapter, Object])
], MdMonthView);
export { MdMonthView };
//# sourceMappingURL=month-view.js.map