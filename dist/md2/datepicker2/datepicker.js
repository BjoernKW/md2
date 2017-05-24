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
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Optional, Output, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { Overlay } from '../core/overlay/overlay';
import { ComponentPortal } from '../core/portal/portal';
import { OverlayState } from '../core/overlay/overlay-state';
import { Dir } from '../core/rtl/dir';
import { MdError } from '../core/errors/error';
import 'rxjs/add/operator/first';
import { DateAdapter } from './date-adapter';
import { createMissingDateImplError } from './datepicker-errors';
import { ESCAPE } from '../core/keyboard/keycodes';
import { MdCalendar } from './calendar';
/** Used to generate a unique ID for each datepicker instance. */
var datepickerUid = 0;
/**
 * Component used as the content for the datepicker dialog and popup. We use this instead of using
 * MdCalendar directly as the content so we can control the initial focus. This also gives us a
 * place to put additional features of the popup that are not part of the calendar itself in the
 * future. (e.g. confirmation buttons).
 * @docs-internal
 */
var MdDatepickerContent = (function () {
    function MdDatepickerContent() {
    }
    MdDatepickerContent.prototype.ngAfterContentInit = function () {
        this._calendar._focusActiveCell();
    };
    /**
     * Handles keydown event on datepicker content.
     * @param event The event.
     */
    MdDatepickerContent.prototype._handleKeydown = function (event) {
        switch (event.keyCode) {
            case ESCAPE:
                this.datepicker.close();
                break;
            default:
                // Return so that we don't preventDefault on keys that are not explicitly handled.
                return;
        }
        event.preventDefault();
    };
    return MdDatepickerContent;
}());
__decorate([
    ViewChild(MdCalendar),
    __metadata("design:type", MdCalendar)
], MdDatepickerContent.prototype, "_calendar", void 0);
MdDatepickerContent = __decorate([
    Component({selector: 'md2-datepicker-content',
        template: "<md2-calendar cdkTrapFocus [id]=\"datepicker.id\" [startAt]=\"datepicker.startAt\" [startView]=\"datepicker.startView\" [minDate]=\"datepicker._minDate\" [maxDate]=\"datepicker._maxDate\" [dateFilter]=\"datepicker._dateFilter\" [selected]=\"datepicker._selected\" (selectedChange)=\"datepicker._selectAndClose($event)\"></md2-calendar>",
        styles: [".md2-calendar{width:296px;box-shadow:0 5px 5px -3px rgba(0,0,0,.2),0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12)}.md2-datepicker-content-touch{display:block;max-height:80vh;overflow:auto;margin:-24px}.md2-datepicker-content-touch .md2-calendar{width:64vmin;height:80vmin;min-width:250px;min-height:312px;max-width:750px;max-height:788px;box-shadow:0 0 0 0 rgba(0,0,0,.2),0 0 0 0 rgba(0,0,0,.14),0 0 0 0 rgba(0,0,0,.12)} /*# sourceMappingURL=datepicker-content.css.map */ "],
        host: {
            'class': 'md2-datepicker-content',
            '[class.md2-datepicker-content-touch]': 'datepicker.touchUi',
            '(keydown)': '_handleKeydown($event)',
        },
        encapsulation: ViewEncapsulation.None,
        changeDetection: ChangeDetectionStrategy.OnPush,
    })
], MdDatepickerContent);
export { MdDatepickerContent };
// TODO(mmalerba): We use a component instead of a directive here so the user can use implicit
// template reference variables (e.g. #d vs #d="mdDatepicker"). We can change this to a directive if
// angular adds support for `exportAs: '$implicit'` on directives.
/** Component responsible for managing the datepicker popup/dialog. */
var MdDatepicker = (function () {
    function MdDatepicker(_overlay, _viewContainerRef, _dateAdapter, _dir) {
        this._overlay = _overlay;
        this._viewContainerRef = _viewContainerRef;
        this._dateAdapter = _dateAdapter;
        this._dir = _dir;
        /** The view that the calendar should start in. */
        this.startView = 'month';
        /**
         * Whether the calendar UI is in touch mode. In touch mode the calendar opens in a dialog rather
         * than a popup and elements have more padding to allow for bigger touch targets.
         */
        this.touchUi = false;
        /** Emits new selected date when selected date changes. */
        this.selectedChanged = new EventEmitter();
        /** Whether the calendar is open. */
        this.opened = false;
        /** The id for the datepicker calendar. */
        this.id = "md-datepicker-" + datepickerUid++;
        /** The currently selected date. */
        this._selected = null;
        if (!this._dateAdapter) {
            throw createMissingDateImplError('DateAdapter');
        }
    }
    Object.defineProperty(MdDatepicker.prototype, "startAt", {
        /** The date to open the calendar to initially. */
        get: function () {
            // If an explicit startAt is set we start there, otherwise we start at whatever the currently
            // selected value is.
            return this._startAt || (this._datepickerInput ? this._datepickerInput.value : null);
        },
        set: function (date) { this._startAt = date; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdDatepicker.prototype, "_minDate", {
        /** The minimum selectable date. */
        get: function () {
            return this._datepickerInput && this._datepickerInput.min;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdDatepicker.prototype, "_maxDate", {
        /** The maximum selectable date. */
        get: function () {
            return this._datepickerInput && this._datepickerInput.max;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MdDatepicker.prototype, "_dateFilter", {
        get: function () {
            return this._datepickerInput && this._datepickerInput._dateFilter;
        },
        enumerable: true,
        configurable: true
    });
    MdDatepicker.prototype.ngOnDestroy = function () {
        this.close();
        if (this._popupRef) {
            this._popupRef.dispose();
        }
        if (this._inputSubscription) {
            this._inputSubscription.unsubscribe();
        }
    };
    /** Selects the given date and closes the currently open popup or dialog. */
    MdDatepicker.prototype._selectAndClose = function (date) {
        var oldValue = this._selected;
        this._selected = date;
        if (!this._dateAdapter.sameDate(oldValue, this._selected)) {
            this.selectedChanged.emit(date);
        }
        this.close();
    };
    /**
     * Register an input with this datepicker.
     * @param input The datepicker input to register with this datepicker.
     */
    MdDatepicker.prototype._registerInput = function (input) {
        var _this = this;
        if (this._datepickerInput) {
            throw new MdError('An MdDatepicker can only be associated with a single input.');
        }
        this._datepickerInput = input;
        this._inputSubscription =
            this._datepickerInput._valueChange.subscribe(function (value) { return _this._selected = value; });
    };
    /** Open the calendar. */
    MdDatepicker.prototype.open = function () {
        if (this.opened) {
            return;
        }
        if (!this._datepickerInput) {
            throw new MdError('Attempted to open an MdDatepicker with no associated input.');
        }
        //this.touchUi ? this._openAsDialog() :
        this._openAsPopup();
        this.opened = true;
    };
    /** Close the calendar. */
    MdDatepicker.prototype.close = function () {
        if (!this.opened) {
            return;
        }
        if (this._popupRef && this._popupRef.hasAttached()) {
            this._popupRef.detach();
        }
        //if (this._dialogRef) {
        //  this._dialogRef.close();
        //  this._dialogRef = null;
        //}
        if (this._calendarPortal && this._calendarPortal.isAttached) {
            this._calendarPortal.detach();
        }
        this.opened = false;
    };
    /** Open the calendar as a dialog. */
    //private _openAsDialog(): void {
    //  let config = new MdDialogConfig();
    //  config.viewContainerRef = this._viewContainerRef;
    //  this._dialogRef = this._dialog.open(MdDatepickerContent, config);
    //  this._dialogRef.afterClosed().first().subscribe(() => this.close());
    //  this._dialogRef.componentInstance.datepicker = this;
    //}
    /** Open the calendar as a popup. */
    MdDatepicker.prototype._openAsPopup = function () {
        var _this = this;
        if (!this._calendarPortal) {
            this._calendarPortal = new ComponentPortal(MdDatepickerContent, this._viewContainerRef);
        }
        if (!this._popupRef) {
            this._createPopup();
        }
        if (!this._popupRef.hasAttached()) {
            var componentRef = this._popupRef.attach(this._calendarPortal);
            componentRef.instance.datepicker = this;
        }
        this._popupRef.backdropClick().first().subscribe(function () { return _this.close(); });
    };
    /** Create the popup. */
    MdDatepicker.prototype._createPopup = function () {
        var overlayState = new OverlayState();
        overlayState.positionStrategy = this._createPopupPositionStrategy();
        overlayState.hasBackdrop = true;
        overlayState.backdropClass = 'md-overlay-transparent-backdrop';
        overlayState.direction = this._dir ? this._dir.value : 'ltr';
        this._popupRef = this._overlay.create(overlayState);
    };
    /** Create the popup PositionStrategy. */
    MdDatepicker.prototype._createPopupPositionStrategy = function () {
        var origin = { originX: 'start', originY: 'bottom' };
        var overlay = { overlayX: 'start', overlayY: 'top' };
        return this._overlay.position().connectedTo(this._datepickerInput.getPopupConnectionElementRef(), origin, overlay);
    };
    return MdDatepicker;
}());
__decorate([
    Input(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], MdDatepicker.prototype, "startAt", null);
__decorate([
    Input(),
    __metadata("design:type", String)
], MdDatepicker.prototype, "startView", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], MdDatepicker.prototype, "touchUi", void 0);
__decorate([
    Input(),
    __metadata("design:type", Function)
], MdDatepicker.prototype, "dateFilter", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], MdDatepicker.prototype, "selectedChanged", void 0);
MdDatepicker = __decorate([
    Component({selector: 'md-datepicker',
        template: '',
    }),
    __param(2, Optional()),
    __param(3, Optional()),
    __metadata("design:paramtypes", [Overlay,
        ViewContainerRef,
        DateAdapter,
        Dir])
], MdDatepicker);
export { MdDatepicker };
//# sourceMappingURL=datepicker.js.map