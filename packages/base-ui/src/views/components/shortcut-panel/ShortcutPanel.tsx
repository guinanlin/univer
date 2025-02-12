import { LocaleService } from '@univerjs/core';
import { useDependency } from '@wendellhu/redi/react-bindings';
import React, { useCallback, useEffect } from 'react';

import { IShortcutService } from '../../../services/shortcut/shortcut.service';
import styles from './index.module.less';

interface IRenderShortcutItem {
    title: string;
    shortcut: string;
}

interface IShortcutGroup {
    items: IRenderShortcutItem[];
    sequence: number;
    name: string;
}

/**
 * This component is responsible for rendering the shortcut panel on the desktop version of the app.
 */
export function ShortcutPanel() {
    const shortcutService = useDependency(IShortcutService);
    const localeService = useDependency(LocaleService);

    const [shortcutItems, setShortcutItems] = React.useState<IShortcutGroup[]>([]);

    const updateShortcuts = useCallback(() => {
        const shortcutGroups = new Map<string, IRenderShortcutItem[]>();

        const shortcuts = shortcutService.getAllShortcuts().filter((item) => !!item.group);
        for (const shortcut of shortcuts) {
            const group = shortcut.group!;
            const shortcutItem: IRenderShortcutItem = {
                title: localeService.t(shortcut.description ?? shortcut.id),
                shortcut: shortcutService.getShortcutDisplay(shortcut),
            };

            if (!/\d+_[a-zA-Z0-9]/.test(group)) {
                throw new Error(`[ShortcutPanel]: Invalid shortcut group: ${group}!`);
            }

            if (!shortcutGroups.has(group)) {
                shortcutGroups.set(group, []);
            }
            shortcutGroups.get(group)!.push(shortcutItem);
        }

        const toRender = Array.from(shortcutGroups.entries())
            .map(([name, items]) => {
                const groupSequence = name.split('_')[0];
                const groupName = name.slice(groupSequence.length + 1);
                return {
                    sequence: +groupSequence,
                    name: localeService.t(groupName),
                    items,
                };
            })
            .sort((a, b) => a.sequence - b.sequence);

        setShortcutItems(toRender);
    }, [shortcutService, localeService]);

    useEffect(() => {
        // first update
        updateShortcuts();

        // subscribe to shortcut changes and re-render
        const subscription = shortcutService.shortcutChanged$.subscribe(() => updateShortcuts());
        return () => subscription.unsubscribe();
    }, [shortcutService]);

    return (
        <div className={styles.shortcutPanel}>
            {shortcutItems.map((group) => (
                <div className={styles.shortcutPanelGroup} key={group.name}>
                    <div className={styles.shortcutPanelGroupTitle}>{group.name}</div>
                    {group.items.map((item, index) => (
                        <div className={styles.shortcutPanelItem} key={index}>
                            <span className={styles.shortcutPanelItemTitle}>{item.title}</span>
                            <span className={styles.shortcutPanelItemShortcut}>{item.shortcut}</span>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}
