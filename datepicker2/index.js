var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { MdMonthView } from './month-view';
import { CommonModule } from '@angular/common';
import { MdCalendarBody } from './calendar-body';
import { MdYearView } from './year-view';
import { OverlayModule } from '../core/overlay/overlay-directives';
import { MdDatepicker, MdDatepickerContent } from './datepicker';
import { MdDatepickerInput } from './datepicker-input';
import { MdCalendar } from './calendar';
import { MdDatepickerToggle } from './datepicker-toggle';
import { StyleModule } from '../core/style/index';
import { MdDatepickerIntl } from './datepicker-intl';
import { DateAdapter } from './date-adapter';
import { NativeDateAdapter } from './native-date-adapter';
import { MD_DATE_FORMATS } from './date-formats';
import { MD_NATIVE_DATE_FORMATS } from './native-date-formats';
export * from './calendar';
export * from './calendar-body';
export * from './datepicker';
export * from './datepicker-input';
export * from './datepicker-intl';
export * from './datepicker-toggle';
export * from './month-view';
export * from './year-view';
export * from './date-adapter';
export * from './native-date-adapter';
var Md2Datepicker2Module = (function () {
    function Md2Datepicker2Module() {
    }
    return Md2Datepicker2Module;
}());
Md2Datepicker2Module = __decorate([
    NgModule({
        imports: [
            CommonModule,
            OverlayModule,
            StyleModule,
        ],
        exports: [
            MdDatepicker,
            MdDatepickerContent,
            MdDatepickerInput,
            MdDatepickerToggle,
        ],
        declarations: [
            MdCalendar,
            MdCalendarBody,
            MdDatepicker,
            MdDatepickerContent,
            MdDatepickerInput,
            MdDatepickerToggle,
            MdMonthView,
            MdYearView,
        ],
        providers: [
            MdDatepickerIntl,
            { provide: DateAdapter, useClass: NativeDateAdapter },
            { provide: MD_DATE_FORMATS, useValue: MD_NATIVE_DATE_FORMATS }
        ],
        entryComponents: [
            MdDatepickerContent,
        ]
    })
], Md2Datepicker2Module);
export { Md2Datepicker2Module };
//# sourceMappingURL=index.js.map