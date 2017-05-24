import { AfterContentInit, EventEmitter, OnDestroy, ViewContainerRef } from '@angular/core';
import { Overlay } from '../core/overlay/overlay';
import { Dir } from '../core/rtl/dir';
import { MdDatepickerInput } from './datepicker-input';
import 'rxjs/add/operator/first';
import { DateAdapter } from './date-adapter';
import { MdCalendar } from './calendar';
/**
 * Component used as the content for the datepicker dialog and popup. We use this instead of using
 * MdCalendar directly as the content so we can control the initial focus. This also gives us a
 * place to put additional features of the popup that are not part of the calendar itself in the
 * future. (e.g. confirmation buttons).
 * @docs-internal
 */
export declare class MdDatepickerContent<D> implements AfterContentInit {
    datepicker: MdDatepicker<D>;
    _calendar: MdCalendar<D>;
    ngAfterContentInit(): void;
    /**
     * Handles keydown event on datepicker content.
     * @param event The event.
     */
    _handleKeydown(event: KeyboardEvent): void;
}
/** Component responsible for managing the datepicker popup/dialog. */
export declare class MdDatepicker<D> implements OnDestroy {
    private _overlay;
    private _viewContainerRef;
    private _dateAdapter;
    private _dir;
    /** The date to open the calendar to initially. */
    startAt: D;
    private _startAt;
    /** The view that the calendar should start in. */
    startView: 'month' | 'year';
    /**
     * Whether the calendar UI is in touch mode. In touch mode the calendar opens in a dialog rather
     * than a popup and elements have more padding to allow for bigger touch targets.
     */
    touchUi: boolean;
    /** A function used to filter which dates are selectable. */
    dateFilter: (date: D) => boolean;
    /** Emits new selected date when selected date changes. */
    selectedChanged: EventEmitter<D>;
    /** Whether the calendar is open. */
    opened: boolean;
    /** The id for the datepicker calendar. */
    id: string;
    /** The currently selected date. */
    _selected: D;
    /** The minimum selectable date. */
    readonly _minDate: D;
    /** The maximum selectable date. */
    readonly _maxDate: D;
    readonly _dateFilter: (date: D | null) => boolean;
    /** A reference to the overlay when the calendar is opened as a popup. */
    private _popupRef;
    /** A portal containing the calendar for this datepicker. */
    private _calendarPortal;
    /** The input element this datepicker is associated with. */
    private _datepickerInput;
    private _inputSubscription;
    constructor(_overlay: Overlay, _viewContainerRef: ViewContainerRef, _dateAdapter: DateAdapter<D>, _dir: Dir);
    ngOnDestroy(): void;
    /** Selects the given date and closes the currently open popup or dialog. */
    _selectAndClose(date: D): void;
    /**
     * Register an input with this datepicker.
     * @param input The datepicker input to register with this datepicker.
     */
    _registerInput(input: MdDatepickerInput<D>): void;
    /** Open the calendar. */
    open(): void;
    /** Close the calendar. */
    close(): void;
    /** Open the calendar as a dialog. */
    /** Open the calendar as a popup. */
    private _openAsPopup();
    /** Create the popup. */
    private _createPopup();
    /** Create the popup PositionStrategy. */
    private _createPopupPositionStrategy();
}