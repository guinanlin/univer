import { SelectionManagerService } from '@univerjs/base-sheets';
import {
    Disposable,
    IRange,
    IUniverInstanceService,
    LifecycleStages,
    OnLifecycle,
    SheetInterceptorService,
} from '@univerjs/core';
import { createIdentifier, Inject } from '@wendellhu/redi';
import { BehaviorSubject, Observable } from 'rxjs';

import {
    chnNumberRule,
    chnWeek2Rule,
    chnWeek3Rule,
    extendNumberRule,
    loopSeriesRule,
    numberRule,
    otherRule,
} from './rules';
import { APPLY_TYPE, IAutoFillRule } from './type';

export interface IAutoFillService {
    getRules(): IAutoFillRule[];
    getApplyType(): APPLY_TYPE;
    isFillingStyle(): boolean;
    setApplyType(type: APPLY_TYPE): void;
    setRanges(sourceRange: IRange, destRange: IRange, applyRange: IRange): void;
    getRanges(): { sourceRange: IRange | null; destRange: IRange | null; applyRange: IRange | null };
    setFillingStyle(isFillingStyle: boolean): void;
    applyType$: Observable<APPLY_TYPE>;
    menu$: Observable<IApplyMenuItem[]>;
    setDisableApplyType: (type: APPLY_TYPE, disable: boolean) => void;
}

export interface IApplyMenuItem {
    label: string;
    value: APPLY_TYPE;
    disable: boolean;
}

@OnLifecycle(LifecycleStages.Rendered, AutoFillService)
export class AutoFillService extends Disposable implements IAutoFillService {
    private _rules: IAutoFillRule[] = [];
    private readonly _applyType$: BehaviorSubject<APPLY_TYPE> = new BehaviorSubject<APPLY_TYPE>(APPLY_TYPE.SERIES);
    private _isFillingStyle: boolean = true;
    private _sourceRange: IRange | null = null;
    private _destRange: IRange | null = null;
    private _applyRange: IRange | null = null;
    readonly applyType$ = this._applyType$.asObservable();

    private readonly _menu$: BehaviorSubject<IApplyMenuItem[]> = new BehaviorSubject<IApplyMenuItem[]>([
        {
            label: 'autoFill.copy',
            value: APPLY_TYPE.COPY,
            disable: false,
        },
        {
            label: 'autoFill.series',
            value: APPLY_TYPE.SERIES,
            disable: false,
        },
        {
            label: 'autoFill.formatOnly',
            value: APPLY_TYPE.ONLY_FORMAT,
            disable: false,
        },
        {
            label: 'autoFill.noFormat',
            value: APPLY_TYPE.NO_FORMAT,
            disable: false,
        },
    ]);
    readonly menu$ = this._menu$.asObservable();
    constructor(
        @Inject(SheetInterceptorService) private _sheetInterceptorService: SheetInterceptorService,
        @Inject(IUniverInstanceService) private _univerInstanceService: IUniverInstanceService,
        @Inject(SelectionManagerService) private _selectionManagerService: SelectionManagerService
    ) {
        super();
        this._init();
    }

    private _init() {
        this._rules = [
            numberRule,
            extendNumberRule,
            chnNumberRule,
            chnWeek2Rule,
            chnWeek3Rule,
            loopSeriesRule,
            otherRule,
        ];
        // this._applyType = APPLY_TYPE.SERIES;
        this._isFillingStyle = true;
    }

    getRules() {
        return this._rules;
    }

    getApplyType() {
        return this._applyType$.getValue();
    }

    setApplyType(type: APPLY_TYPE) {
        this._applyType$.next(type);
    }

    isFillingStyle(): boolean {
        return this._isFillingStyle;
    }

    setFillingStyle(isFillingStyle: boolean) {
        this._isFillingStyle = isFillingStyle;
    }

    setRanges(destRange: IRange, sourceRange: IRange, applyRange: IRange) {
        this._sourceRange = sourceRange;
        this._destRange = destRange;
        this._applyRange = applyRange;
    }

    getRanges() {
        return {
            sourceRange: this._sourceRange,
            destRange: this._destRange,
            applyRange: this._applyRange,
        };
    }

    setDisableApplyType(type: APPLY_TYPE, disable: boolean) {
        this._menu$.next(
            this._menu$.getValue().map((item) => {
                if (item.value === type) {
                    return {
                        ...item,
                        disable,
                    };
                }
                return item;
            })
        );
    }
}

export const IAutoFillService = createIdentifier<AutoFillService>('univer.auto-fill-service');
