var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { MdDatepicker } from './datepicker';
import { MdDatepickerIntl } from './datepicker-intl';
var MdDatepickerToggle = (function () {
    function MdDatepickerToggle(_intl) {
        this._intl = _intl;
    }
    Object.defineProperty(MdDatepickerToggle.prototype, "_datepicker", {
        get: function () { return this.datepicker; },
        set: function (v) { this.datepicker = v; },
        enumerable: true,
        configurable: true
    });
    MdDatepickerToggle.prototype._open = function (event) {
        if (this.datepicker) {
            this.datepicker.open();
            event.stopPropagation();
        }
    };
    return MdDatepickerToggle;
}());
__decorate([
    Input('mdDatepickerToggle'),
    __metadata("design:type", MdDatepicker)
], MdDatepickerToggle.prototype, "datepicker", void 0);
__decorate([
    Input('matDatepickerToggle'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [MdDatepicker])
], MdDatepickerToggle.prototype, "_datepicker", null);
MdDatepickerToggle = __decorate([
    Component({selector: 'button[mdDatepickerToggle], button[matDatepickerToggle]',
        template: '',
        styles: [".md2-datepicker-toggle{display:inline-block;background:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNHB4IiBoZWlnaHQ9IjI0cHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iY3VycmVudENvbG9yIj48cGF0aCBkPSJNMCAwaDI0djI0SDB6IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTE5IDNoLTFWMWgtMnYySDhWMUg2djJINWMtMS4xMSAwLTEuOTkuOS0xLjk5IDJMMyAxOWMwIDEuMS44OSAyIDIgMmgxNGMxLjEgMCAyLS45IDItMlY1YzAtMS4xLS45LTItMi0yem0wIDE2SDVWOGgxNHYxMXpNNyAxMGg1djVIN3oiLz48L3N2Zz4=) no-repeat;background-size:contain;height:24px;width:24px;border:none;outline:0;vertical-align:middle} /*# sourceMappingURL=datepicker-toggle.css.map */ "],
        host: {
            '[class.md2-datepicker-toggle]': 'true',
            '[attr.aria-label]': '_intl.openCalendarLabel',
            '(click)': '_open($event)',
        },
        encapsulation: ViewEncapsulation.None,
        changeDetection: ChangeDetectionStrategy.OnPush,
    }),
    __metadata("design:paramtypes", [MdDatepickerIntl])
], MdDatepickerToggle);
export { MdDatepickerToggle };
//# sourceMappingURL=datepicker-toggle.js.map