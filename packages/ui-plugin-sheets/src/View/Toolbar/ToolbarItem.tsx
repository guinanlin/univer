import { ComponentChild, Component } from 'preact';
import { Subscription } from 'rxjs';

import { AppContext, Button, Tooltip, CustomLabel, IDisplayMenuItem, MenuItemType, Select, IMenuSelectorItem, IMenuItem } from '@univerjs/base-ui';
import { ICommandService } from '@univerjs/core';

import styles from './index.module.less';

export interface IToolbarItemStatus {
    disabled: boolean;
    activated: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any;
}

export class ToolbarItem extends Component<IDisplayMenuItem<IMenuItem>, IToolbarItemStatus> {
    static override contextType = AppContext;

    private disabledSubscription: Subscription | undefined;

    private activatedSubscription: Subscription | undefined;

    private currentValueSubscription: Subscription | undefined;

    constructor() {
        super();

        this.state = {
            disabled: false,
            activated: false,
            value: undefined,
        };
    }

    override componentDidMount() {
        this.disabledSubscription = this.props.disabled$?.subscribe((disabled) => {
            this.setState({ disabled });
        });

        this.activatedSubscription = this.props.activated$?.subscribe((activated) => {
            this.setState({ activated });
        });

        if (this.props.type === MenuItemType.SELECTOR) {
            const props = this.props as IDisplayMenuItem<IMenuSelectorItem>;
            this.currentValueSubscription = props.value$?.subscribe((value) => {
                this.setState({ value });
            });
        }
    }

    override componentWillMount() {
        this.disabledSubscription?.unsubscribe();
        this.activatedSubscription?.unsubscribe();
    }

    render(): ComponentChild {
        // here we render different types of toolbar item according to their type
        switch (this.props.type) {
            case MenuItemType.SELECTOR:
                return this.renderSelectorType();
            default:
                return this.renderButtonType();
        }
    }

    private renderSelectorType(): ComponentChild {
        const { context, state } = this;
        const commandService: ICommandService = context.injector.get(ICommandService);
        const { disabled, activated, value } = state;

        const props = this.props as IDisplayMenuItem<IMenuSelectorItem>;

        return (
            <Tooltip title={props.tooltip + (props.shortcut ? ` (${props.shortcut})` : '')} placement="bottom">
                <Select
                    className={props.className}
                    label={value ?? props.label}
                    display={props.display}
                    type={props.selectType!}
                    children={props.selections!}
                    onClick={(value) => commandService.executeCommand(props.id, { value })}
                    onPressEnter={(value) => commandService.executeCommand(props.id, { value })}
                ></Select>
            </Tooltip>
        );
    }

    private renderButtonType(): ComponentChild {
        const { props, context, state } = this;
        const commandService: ICommandService = context.injector.get(ICommandService);
        const { disabled, activated } = state;

        return (
            <Tooltip title={props.title + (props.shortcut ? ` (${props.shortcut})` : '')} placement="bottom">
                <Button active={activated} className={styles.textButton} type="text" disabled={disabled} onClick={() => commandService.executeCommand(props.id)}>
                    <CustomLabel label={{ name: props.icon }} />
                </Button>
            </Tooltip>
        );
    }
}
