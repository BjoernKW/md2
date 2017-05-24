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
/**
 * An internal component used to display a single year in the datepicker.
 * @docs-private
 */
var MdYearView = (function () {
    function MdYearView(_dateAdapter, _dateFormats) {
        this._dateAdapter = _dateAdapter;
        this._dateFormats = _dateFormats;
        /** Emits when a new month is selected. */
        this.selectedChange = new EventEmitter();
        if (!this._dateAdapter) {
            throw createMissingDateImplError('DateAdapter');
        }
        if (!this._dateFormats) {
            throw createMissingDateImplError('MD_DATE_FORMATS');
        }
        this._activeDate = this._dateAdapter.today();
    }
    Object.defineProperty(MdYearView.prototype, "activeDate", {
        /** The date to display in this year view (everything other than the year is ignored). */
        get: function () { return this._activeDate; },
        set: function (value) {
            var oldActiveDate = this._activeDate;
            this._activeDate = value || this._dateAdapter.today();
            if (this._dateAdapter.getYear(oldActiveDate) != this._dateAdapter.getYear(this._activeDate)) {
                this._init();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdYearView.prototype, "selected", {
        /** The currently selected date. */
        get: function () { return this._selected; },
        set: function (value) {
            this._selected = value;
            this._selectedMonth = this._getMonthInCurrentYear(this.selected);
        },
        enumerable: true,
        configurable: true
    });
    MdYearView.prototype.ngAfterContentInit = function () {
        this._init();
    };
    /** Handles when a new month is selected. */
    MdYearView.prototype._monthSelected = function (month) {
        this.selectedChange.emit(this._dateAdapter.createDate(this._dateAdapter.getYear(this.activeDate), month, this._dateAdapter.getDate(this.activeDate)));
    };
    /** Initializes this month view. */
    MdYearView.prototype._init = function () {
        var _this = this;
        this._selectedMonth = this._getMonthInCurrentYear(this.selected);
        this._todayMonth = this._getMonthInCurrentYear(this._dateAdapter.today());
        this._yearLabel = this._dateAdapter.getYearName(this.activeDate);
        var monthNames = this._dateAdapter.getMonthNames('short');
        // First row of months only contains 5 elements so we can fit the year label on the same row.
        this._months = [[0, 1, 2, 3, 4], [5, 6, 7, 8, 9, 10, 11]].map(function (row) { return row.map(function (month) { return _this._createCellForMonth(month, monthNames[month]); }); });
    };
    /**
     * Gets the month in this year that the given Date falls on.
     * Returns null if the given Date is in another year.
     */
    MdYearView.prototype._getMonthInCurrentYear = function (date) {
        return date && this._dateAdapter.getYear(date) == this._dateAdapter.getYear(this.activeDate) ?
            this._dateAdapter.getMonth(date) : null;
    };
    /** Creates an MdCalendarCell for the given month. */
    MdYearView.prototype._createCellForMonth = function (month, monthName) {
        var ariaLabel = this._dateAdapter.format(this._dateAdapter.createDate(this._dateAdapter.getYear(this.activeDate), month, 1), this._dateFormats.display.monthYearA11yLabel);
        return new MdCalendarCell(month, monthName.toLocaleUpperCase(), ariaLabel, this._isMonthEnabled(month));
    };
    /** Whether the given month is enabled. */
    MdYearView.prototype._isMonthEnabled = function (month) {
        if (!this.dateFilter) {
            return true;
        }
        var firstOfMonth = this._dateAdapter.createDate(this._dateAdapter.getYear(this.activeDate), month, 1);
        // If any date in the month is enabled count the month as enabled.
        for (var date = firstOfMonth; this._dateAdapter.getMonth(date) == month; date = this._dateAdapter.addCalendarDays(date, 1)) {
            if (this.dateFilter(date)) {
                return true;
            }
        }
        return false;
    };
    return MdYearView;
}());
__decorate([
    Input(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], MdYearView.prototype, "activeDate", null);
__decorate([
    Input(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], MdYearView.prototype, "selected", null);
__decorate([
    Input(),
    __metadata("design:type", Function)
], MdYearView.prototype, "dateFilter", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], MdYearView.prototype, "selectedChange", void 0);
MdYearView = __decorate([
    Component({selector: 'md2-year-view',
        template: "<table class=\"md2-calendar-table\"><thead class=\"md2-calendar-table-header\"><tr><th class=\"md2-calendar-table-header-divider\" colspan=\"7\"></th></tr></thead><tbody md2-calendar-body role=\"grid\" allowDisabledSelection=\"true\" [label]=\"_yearLabel\" [rows]=\"_months\" [todayValue]=\"_todayMonth\" [selectedValue]=\"_selectedMonth\" [labelMinRequiredCells]=\"2\" [activeCell]=\"_dateAdapter.getMonth(activeDate)\" (selectedValueChange)=\"_monthSelected($event)\"></tbody></table>",
        encapsulation: ViewEncapsulation.None,
        changeDetection: ChangeDetectionStrategy.OnPush,
    }),
    __param(0, Optional()),
    __param(1, Optional()), __param(1, Inject(MD_DATE_FORMATS)),
    __metadata("design:paramtypes", [DateAdapter, Object])
], MdYearView);
export { MdYearView };
//# sourceMappingURL=year-view.js.map