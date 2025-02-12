import { DeviceInputEventType } from '@univerjs/base-render';
import { IShortcutItem, KeyCode, MetaKeys } from '@univerjs/base-ui';
import { whenEditorInputFormulaActivated } from '@univerjs/ui-plugin-sheets';

import { SelectEditorFormulaOperation } from '../../commands/operations/editor-formula.operation';
import { ReferenceAbsoluteOperation } from '../../commands/operations/reference-absolute.operation';
import { META_KEY_CTRL_AND_SHIFT } from '../../common/prompt';

export const PROMPT_SELECTION_KEYCODE_ARROW_LIST = [
    KeyCode.ARROW_DOWN,
    KeyCode.ARROW_UP,
    KeyCode.ARROW_LEFT,
    KeyCode.ARROW_RIGHT,
];

export const PROMPT_SELECTION_KEYCODE_LIST = [...PROMPT_SELECTION_KEYCODE_ARROW_LIST, KeyCode.ENTER, KeyCode.TAB];

export function promptSelectionShortcutItem() {
    const shortcutList: IShortcutItem[] = [];
    for (const keycode of PROMPT_SELECTION_KEYCODE_LIST) {
        shortcutList.push({
            id: SelectEditorFormulaOperation.id,
            binding: keycode,
            preconditions: (contextService) => whenEditorInputFormulaActivated(contextService),
            staticParameters: {
                eventType: DeviceInputEventType.Keyboard,
                keycode,
            },
        });
    }
    return shortcutList;
}

export function promptSelectionShortcutItemShift() {
    const shortcutList: IShortcutItem[] = [];
    for (const keycode of PROMPT_SELECTION_KEYCODE_ARROW_LIST) {
        shortcutList.push({
            id: SelectEditorFormulaOperation.id,
            binding: keycode | MetaKeys.SHIFT,
            preconditions: (contextService) => whenEditorInputFormulaActivated(contextService),
            staticParameters: {
                eventType: DeviceInputEventType.Keyboard,
                keycode,
                metaKey: MetaKeys.SHIFT,
            },
        });
    }
    return shortcutList;
}

export function promptSelectionShortcutItemCtrl() {
    const shortcutList: IShortcutItem[] = [];
    for (const keycode of PROMPT_SELECTION_KEYCODE_ARROW_LIST) {
        shortcutList.push({
            id: SelectEditorFormulaOperation.id,
            binding: keycode | MetaKeys.CTRL_COMMAND,
            preconditions: (contextService) => whenEditorInputFormulaActivated(contextService),
            staticParameters: {
                eventType: DeviceInputEventType.Keyboard,
                keycode,
                metaKey: MetaKeys.CTRL_COMMAND,
            },
        });
    }
    return shortcutList;
}

export function promptSelectionShortcutItemCtrlAndShift() {
    const shortcutList: IShortcutItem[] = [];
    for (const keycode of PROMPT_SELECTION_KEYCODE_ARROW_LIST) {
        shortcutList.push({
            id: SelectEditorFormulaOperation.id,
            binding: keycode | MetaKeys.SHIFT | MetaKeys.CTRL_COMMAND,
            preconditions: (contextService) => whenEditorInputFormulaActivated(contextService),
            staticParameters: {
                eventType: DeviceInputEventType.Keyboard,
                keycode,
                metaKey: META_KEY_CTRL_AND_SHIFT,
            },
        });
    }
    return shortcutList;
}

export const ChangeRefToAbsoluteShortcut: IShortcutItem = {
    id: ReferenceAbsoluteOperation.id,
    binding: KeyCode.F4,
    preconditions: (contextService) => whenEditorInputFormulaActivated(contextService),
};
