var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
/**
 * An internal class that represents the data corresponding to a single calendar cell.
 * @docs-private
 */
var MdCalendarCell = (function () {
    function MdCalendarCell(value, displayValue, ariaLabel, enabled) {
        this.value = value;
        this.displayValue = displayValue;
        this.ariaLabel = ariaLabel;
        this.enabled = enabled;
    }
    return MdCalendarCell;
}());
export { MdCalendarCell };
/**
 * An internal component used to display calendar data in a table.
 * @docs-private
 */
var MdCalendarBody = (function () {
    function MdCalendarBody() {
        /** The number of columns in the table. */
        this.numCols = 7;
        /** Whether to allow selection of disabled cells. */
        this.allowDisabledSelection = false;
        /** The cell number of the active cell in the table. */
        this.activeCell = 0;
        /** Emits when a new value is selected. */
        this.selectedValueChange = new EventEmitter();
    }
    MdCalendarBody.prototype._cellClicked = function (cell) {
        if (!this.allowDisabledSelection && !cell.enabled) {
            return;
        }
        this.selectedValueChange.emit(cell.value);
    };
    Object.defineProperty(MdCalendarBody.prototype, "_firstRowOffset", {
        /** The number of blank cells to put at the beginning for the first row. */
        get: function () {
            return this.rows && this.rows.length && this.rows[0].length ?
                this.numCols - this.rows[0].length : 0;
        },
        enumerable: true,
        configurable: true
    });
    MdCalendarBody.prototype._isActiveCell = function (rowIndex, colIndex) {
        var cellNumber = rowIndex * this.numCols + colIndex;
        // Account for the fact that the first row may not have as many cells.
        if (rowIndex) {
            cellNumber -= this._firstRowOffset;
        }
        return cellNumber == this.activeCell;
    };
    return MdCalendarBody;
}());
__decorate([
    Input(),
    __metadata("design:type", String)
], MdCalendarBody.prototype, "label", void 0);
__decorate([
    Input(),
    __metadata("design:type", Array)
], MdCalendarBody.prototype, "rows", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], MdCalendarBody.prototype, "todayValue", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], MdCalendarBody.prototype, "selectedValue", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], MdCalendarBody.prototype, "labelMinRequiredCells", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], MdCalendarBody.prototype, "numCols", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], MdCalendarBody.prototype, "allowDisabledSelection", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], MdCalendarBody.prototype, "activeCell", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], MdCalendarBody.prototype, "selectedValueChange", void 0);
MdCalendarBody = __decorate([
    Component({selector: '[md2-calendar-body]',
        template: "<tr *ngIf=\"_firstRowOffset < labelMinRequiredCells\" aria-hidden=\"true\"><td class=\"md2-calendar-body-label\" [attr.colspan]=\"numCols\">{{label}}</td></tr><tr *ngFor=\"let row of rows; let rowIndex = index\" role=\"row\"><td *ngIf=\"rowIndex === 0 && _firstRowOffset\" aria-hidden=\"true\" class=\"md2-calendar-body-label\" [attr.colspan]=\"_firstRowOffset\">{{_firstRowOffset >= labelMinRequiredCells ? label : ''}}</td><td *ngFor=\"let item of row; let colIndex = index\" role=\"gridcell\" class=\"md2-calendar-body-cell\" [tabindex]=\"_isActiveCell(rowIndex, colIndex) ? 0 : -1\" [class.md2-calendar-body-disabled]=\"!item.enabled\" [class.md2-calendar-body-active]=\"_isActiveCell(rowIndex, colIndex)\" [attr.aria-label]=\"item.ariaLabel\" [attr.aria-disabled]=\"!item.enabled || null\" (click)=\"_cellClicked(item)\"><div class=\"md2-calendar-body-cell-content\" [class.md2-calendar-body-selected]=\"selectedValue === item.value\" [class.md2-calendar-body-today]=\"todayValue === item.value\">{{item.displayValue}}</div></td></tr>",
        styles: [".md2-calendar-body{font-size:13px;min-width:224px}.md2-calendar-body-label{padding:7.14286% 0 7.14286% 7.14286%;height:0;line-height:0;color:#000;transform:translateX(-6px);text-align:left;font-size:14px;font-weight:700}.md2-calendar-body-cell{position:relative;width:14.28571%;height:0;line-height:0;padding:7.14286% 0;text-align:center;outline:0}.md2-calendar-body-cell-content{position:absolute;top:5%;left:5%;display:flex;align-items:center;justify-content:center;box-sizing:border-box;width:90%;height:90%;border-width:1px;border-style:solid;border-radius:50%;color:#000;border-color:transparent}.md2-calendar-body-disabled>.md2-calendar-body-cell-content:not(.md2-calendar-body-selected){color:#000}[dir=rtl] .md2-calendar-body-label{padding:0 7.14286% 0 0;transform:translateX(6px);text-align:right}.cdk-keyboard-focused .md2-calendar-body-active>.md2-calendar-body-cell-content:not(.md2-calendar-body-selected),:not(.md2-calendar-body-disabled):hover>.md2-calendar-body-cell-content:not(.md2-calendar-body-selected){background-color:#fff}.md2-calendar-body-selected{background-color:#0094ff;color:#0094ff}.md2-calendar-body-disabled>.md2-calendar-body-selected{background-color:rgba(0,148,255,.4)}.md2-calendar-body-today:not(.md2-calendar-body-selected){border-color:#000}.md2-calendar-body-today.md2-calendar-body-selected{box-shadow:inset 0 0 0 1px #0094ff}.md2-calendar-body-disabled>.md2-calendar-body-today:not(.md2-calendar-body-selected){border-color:rgba(0,0,0,.8)} /*# sourceMappingURL=calendar-body.css.map */ "],
        host: {
            'class': 'md2-calendar-body',
        },
        encapsulation: ViewEncapsulation.None,
        changeDetection: ChangeDetectionStrategy.OnPush,
    })
], MdCalendarBody);
export { MdCalendarBody };
//# sourceMappingURL=calendar-body.js.map