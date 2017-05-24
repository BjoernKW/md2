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
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Inject, Input, NgZone, Optional, Output, ViewEncapsulation } from '@angular/core';
import { DOWN_ARROW, END, ENTER, HOME, LEFT_ARROW, PAGE_DOWN, PAGE_UP, RIGHT_ARROW, UP_ARROW } from '../core/keyboard/keycodes';
import { DateAdapter } from './date-adapter';
import { MdDatepickerIntl } from './datepicker-intl';
import { createMissingDateImplError } from './datepicker-errors';
import { MD_DATE_FORMATS } from './date-formats';
/**
 * A calendar that is used as part of the datepicker.
 * @docs-private
 */
var MdCalendar = (function () {
    function MdCalendar(_elementRef, _intl, _ngZone, _dateAdapter, _dateFormats) {
        var _this = this;
        this._elementRef = _elementRef;
        this._intl = _intl;
        this._ngZone = _ngZone;
        this._dateAdapter = _dateAdapter;
        this._dateFormats = _dateFormats;
        /** Whether the calendar should be started in month or year view. */
        this.startView = 'month';
        /** Emits when the currently selected date changes. */
        this.selectedChange = new EventEmitter();
        /** Date filter for the month and year views. */
        this._dateFilterForViews = function (date) {
            return !!date &&
                (!_this.dateFilter || _this.dateFilter(date)) &&
                (!_this.minDate || _this._dateAdapter.compareDate(date, _this.minDate) >= 0) &&
                (!_this.maxDate || _this._dateAdapter.compareDate(date, _this.maxDate) <= 0);
        };
        if (!this._dateAdapter) {
            throw createMissingDateImplError('DateAdapter');
        }
        if (!this._dateFormats) {
            throw createMissingDateImplError('MD_DATE_FORMATS');
        }
    }
    Object.defineProperty(MdCalendar.prototype, "_activeDate", {
        /**
         * The current active date. This determines which time period is shown and which date is
         * highlighted when using keyboard navigation.
         */
        get: function () { return this._clampedActiveDate; },
        set: function (value) {
            this._clampedActiveDate = this._dateAdapter.clampDate(value, this.minDate, this.maxDate);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdCalendar.prototype, "_periodButtonText", {
        /** The label for the current calendar view. */
        get: function () {
            return this._monthView ?
                this._dateAdapter.format(this._activeDate, this._dateFormats.display.monthYearLabel)
                    .toLocaleUpperCase() :
                this._dateAdapter.getYearName(this._activeDate);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdCalendar.prototype, "_periodButtonLabel", {
        get: function () {
            return this._monthView ? this._intl.switchToYearViewLabel : this._intl.switchToMonthViewLabel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdCalendar.prototype, "_prevButtonLabel", {
        /** The label for the the previous button. */
        get: function () {
            return this._monthView ? this._intl.prevMonthLabel : this._intl.prevYearLabel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdCalendar.prototype, "_nextButtonLabel", {
        /** The label for the the next button. */
        get: function () {
            return this._monthView ? this._intl.nextMonthLabel : this._intl.nextYearLabel;
        },
        enumerable: true,
        configurable: true
    });
    MdCalendar.prototype.ngAfterContentInit = function () {
        this._activeDate = this.startAt || this._dateAdapter.today();
        this._focusActiveCell();
        this._monthView = this.startView != 'year';
    };
    /** Handles date selection in the month view. */
    MdCalendar.prototype._dateSelected = function (date) {
        if (!this._dateAdapter.sameDate(date, this.selected)) {
            this.selectedChange.emit(date);
        }
    };
    /** Handles month selection in the year view. */
    MdCalendar.prototype._monthSelected = function (month) {
        this._activeDate = month;
        this._monthView = true;
    };
    /** Handles user clicks on the period label. */
    MdCalendar.prototype._currentPeriodClicked = function () {
        this._monthView = !this._monthView;
    };
    /** Handles user clicks on the previous button. */
    MdCalendar.prototype._previousClicked = function () {
        this._activeDate = this._monthView ?
            this._dateAdapter.addCalendarMonths(this._activeDate, -1) :
            this._dateAdapter.addCalendarYears(this._activeDate, -1);
    };
    /** Handles user clicks on the next button. */
    MdCalendar.prototype._nextClicked = function () {
        this._activeDate = this._monthView ?
            this._dateAdapter.addCalendarMonths(this._activeDate, 1) :
            this._dateAdapter.addCalendarYears(this._activeDate, 1);
    };
    /** Whether the previous period button is enabled. */
    MdCalendar.prototype._previousEnabled = function () {
        if (!this.minDate) {
            return true;
        }
        return !this.minDate || !this._isSameView(this._activeDate, this.minDate);
    };
    /** Whether the next period button is enabled. */
    MdCalendar.prototype._nextEnabled = function () {
        return !this.maxDate || !this._isSameView(this._activeDate, this.maxDate);
    };
    /** Handles keydown events on the calendar body. */
    MdCalendar.prototype._handleCalendarBodyKeydown = function (event) {
        // TODO(mmalerba): We currently allow keyboard navigation to disabled dates, but just prevent
        // disabled ones from being selected. This may not be ideal, we should look into whether
        // navigation should skip over disabled dates, and if so, how to implement that efficiently.
        if (this._monthView) {
            this._handleCalendarBodyKeydownInMonthView(event);
        }
        else {
            this._handleCalendarBodyKeydownInYearView(event);
        }
    };
    /** Focuses the active cell after the microtask queue is empty. */
    MdCalendar.prototype._focusActiveCell = function () {
        var _this = this;
        this._ngZone.runOutsideAngular(function () { return _this._ngZone.onStable.first().subscribe(function () {
            var activeEl = _this._elementRef.nativeElement.querySelector('.md2-calendar-body-active');
            activeEl.focus();
        }); });
    };
    /** Whether the two dates represent the same view in the current view mode (month or year). */
    MdCalendar.prototype._isSameView = function (date1, date2) {
        return this._monthView ?
            this._dateAdapter.getYear(date1) == this._dateAdapter.getYear(date2) &&
                this._dateAdapter.getMonth(date1) == this._dateAdapter.getMonth(date2) :
            this._dateAdapter.getYear(date1) == this._dateAdapter.getYear(date2);
    };
    /** Handles keydown events on the calendar body when calendar is in month view. */
    MdCalendar.prototype._handleCalendarBodyKeydownInMonthView = function (event) {
        switch (event.keyCode) {
            case LEFT_ARROW:
                this._activeDate = this._dateAdapter.addCalendarDays(this._activeDate, -1);
                break;
            case RIGHT_ARROW:
                this._activeDate = this._dateAdapter.addCalendarDays(this._activeDate, 1);
                break;
            case UP_ARROW:
                this._activeDate = this._dateAdapter.addCalendarDays(this._activeDate, -7);
                break;
            case DOWN_ARROW:
                this._activeDate = this._dateAdapter.addCalendarDays(this._activeDate, 7);
                break;
            case HOME:
                this._activeDate = this._dateAdapter.addCalendarDays(this._activeDate, 1 - this._dateAdapter.getDate(this._activeDate));
                break;
            case END:
                this._activeDate = this._dateAdapter.addCalendarDays(this._activeDate, (this._dateAdapter.getNumDaysInMonth(this._activeDate) -
                    this._dateAdapter.getDate(this._activeDate)));
                break;
            case PAGE_UP:
                this._activeDate = event.altKey ?
                    this._dateAdapter.addCalendarYears(this._activeDate, -1) :
                    this._dateAdapter.addCalendarMonths(this._activeDate, -1);
                break;
            case PAGE_DOWN:
                this._activeDate = event.altKey ?
                    this._dateAdapter.addCalendarYears(this._activeDate, 1) :
                    this._dateAdapter.addCalendarMonths(this._activeDate, 1);
                break;
            case ENTER:
                if (this._dateFilterForViews(this._activeDate)) {
                    this._dateSelected(this._activeDate);
                    // Prevent unexpected default actions such as form submission.
                    event.preventDefault();
                }
                return;
            default:
                // Don't prevent default or focus active cell on keys that we don't explicitly handle.
                return;
        }
        this._focusActiveCell();
        // Prevent unexpected default actions such as form submission.
        event.preventDefault();
    };
    /** Handles keydown events on the calendar body when calendar is in year view. */
    MdCalendar.prototype._handleCalendarBodyKeydownInYearView = function (event) {
        switch (event.keyCode) {
            case LEFT_ARROW:
                this._activeDate = this._dateAdapter.addCalendarMonths(this._activeDate, -1);
                break;
            case RIGHT_ARROW:
                this._activeDate = this._dateAdapter.addCalendarMonths(this._activeDate, 1);
                break;
            case UP_ARROW:
                this._activeDate = this._prevMonthInSameCol(this._activeDate);
                break;
            case DOWN_ARROW:
                this._activeDate = this._nextMonthInSameCol(this._activeDate);
                break;
            case HOME:
                this._activeDate = this._dateAdapter.addCalendarMonths(this._activeDate, -this._dateAdapter.getMonth(this._activeDate));
                break;
            case END:
                this._activeDate = this._dateAdapter.addCalendarMonths(this._activeDate, 11 - this._dateAdapter.getMonth(this._activeDate));
                break;
            case PAGE_UP:
                this._activeDate =
                    this._dateAdapter.addCalendarYears(this._activeDate, event.altKey ? -10 : -1);
                break;
            case PAGE_DOWN:
                this._activeDate =
                    this._dateAdapter.addCalendarYears(this._activeDate, event.altKey ? 10 : 1);
                break;
            case ENTER:
                this._monthSelected(this._activeDate);
                break;
            default:
                // Don't prevent default or focus active cell on keys that we don't explicitly handle.
                return;
        }
        this._focusActiveCell();
        // Prevent unexpected default actions such as form submission.
        event.preventDefault();
    };
    /**
     * Determine the date for the month that comes before the given month in the same column in the
     * calendar table.
     */
    MdCalendar.prototype._prevMonthInSameCol = function (date) {
        // Determine how many months to jump forward given that there are 2 empty slots at the beginning
        // of each year.
        var increment = this._dateAdapter.getMonth(date) <= 4 ? -5 :
            (this._dateAdapter.getMonth(date) >= 7 ? -7 : -12);
        return this._dateAdapter.addCalendarMonths(date, increment);
    };
    /**
     * Determine the date for the month that comes after the given month in the same column in the
     * calendar table.
     */
    MdCalendar.prototype._nextMonthInSameCol = function (date) {
        // Determine how many months to jump forward given that there are 2 empty slots at the beginning
        // of each year.
        var increment = this._dateAdapter.getMonth(date) <= 4 ? 7 :
            (this._dateAdapter.getMonth(date) >= 7 ? 5 : 12);
        return this._dateAdapter.addCalendarMonths(date, increment);
    };
    return MdCalendar;
}());
__decorate([
    Input(),
    __metadata("design:type", Object)
], MdCalendar.prototype, "startAt", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], MdCalendar.prototype, "startView", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], MdCalendar.prototype, "selected", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], MdCalendar.prototype, "minDate", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], MdCalendar.prototype, "maxDate", void 0);
__decorate([
    Input(),
    __metadata("design:type", Function)
], MdCalendar.prototype, "dateFilter", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], MdCalendar.prototype, "selectedChange", void 0);
MdCalendar = __decorate([
    Component({selector: 'md2-calendar',
        template: "<div class=\"md2-calendar-header\"><div class=\"md2-calendar-controls\"><button type=\"button\" class=\"md2-calendar-period-button\" (click)=\"_currentPeriodClicked()\" [attr.aria-label]=\"_periodButtonLabel\">{{_periodButtonText}}<div class=\"md2-calendar-arrow\" [class.md2-calendar-invert]=\"!_monthView\"></div></button><div class=\"md2-calendar-spacer\"></div><button type=\"button\" class=\"md2-calendar-previous-button\" [disabled]=\"!_previousEnabled()\" (click)=\"_previousClicked()\" [attr.aria-label]=\"_prevButtonLabel\"></button> <button type=\"button\" class=\"md2-calendar-next-button\" [disabled]=\"!_nextEnabled()\" (click)=\"_nextClicked()\" [attr.aria-label]=\"_nextButtonLabel\"></button></div></div><div class=\"md2-calendar-content\" (keydown)=\"_handleCalendarBodyKeydown($event)\" cdkMonitorSubtreeFocus><md2-month-view *ngIf=\"_monthView\" [activeDate]=\"_activeDate\" [selected]=\"selected\" [dateFilter]=\"_dateFilterForViews\" (selectedChange)=\"_dateSelected($event)\"></md2-month-view><md2-year-view *ngIf=\"!_monthView\" [activeDate]=\"_activeDate\" [selected]=\"selected\" [dateFilter]=\"_dateFilterForViews\" (selectedChange)=\"_monthSelected($event)\"></md2-year-view></div>",
        styles: [".md2-calendar{display:block;background-color:#fff}.md2-calendar-header{padding:8px 8px 0 8px}.md2-calendar-content{padding:0 8px 8px 8px;outline:0}.md2-calendar-controls{display:flex;padding:5% calc(100% / 14 - 22px) 5% calc(100% / 14 - 22px)}.md2-calendar-spacer{flex:1 1 auto}.md2-calendar-period-button{font:inherit;font-size:14px;font-weight:700;min-width:0}.md2-calendar-arrow{display:inline-block;width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top-width:5px;border-top-style:solid;border-top-color:#000;margin:0 0 0 5px;vertical-align:middle}.md2-calendar-arrow.md2-calendar-invert{transform:rotate(180deg)}.md2-calendar-next-button,.md2-calendar-previous-button{position:relative;color:#000}.md2-calendar-next-button::after,.md2-calendar-previous-button::after{content:'';position:absolute;top:0;left:0;bottom:0;right:0;margin:15.5px;border:0 solid currentColor;border-top-width:2px}.md2-calendar-previous-button::after{border-left-width:2px;transform:translateX(2px) rotate(-45deg)}.md2-calendar-next-button::after{border-right-width:2px;transform:translateX(-2px) rotate(45deg)}.md2-calendar-table{border-spacing:0;border-collapse:collapse;width:100%}.md2-calendar-table-header{color:#000}.md2-calendar-table-header th{text-align:center;font-size:11px;font-weight:400;padding:0 0 8px 0}.md2-calendar-table-header-divider{position:relative;height:1px}.md2-calendar-table-header-divider::after{content:'';position:absolute;top:0;left:-8px;right:-8px;height:1px;background:#000} /*# sourceMappingURL=calendar.css.map */ "],
        host: {
            '[class.md2-calendar]': 'true',
        },
        encapsulation: ViewEncapsulation.None,
        changeDetection: ChangeDetectionStrategy.OnPush,
    }),
    __param(3, Optional()),
    __param(4, Optional()), __param(4, Inject(MD_DATE_FORMATS)),
    __metadata("design:paramtypes", [ElementRef,
        MdDatepickerIntl,
        NgZone,
        DateAdapter, Object])
], MdCalendar);
export { MdCalendar };
//# sourceMappingURL=calendar.js.map