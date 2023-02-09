import { AppContext, BaseComponentProps, Component } from '@univerjs/base-ui';
import { LocaleType } from '@univerjs/core';
import { BaseSheetContainerProps, SheetContainer } from './SheetContainer';

export interface BaseUIProps extends BaseComponentProps {
    locale: LocaleType;
    UIConfig: BaseSheetContainerProps;
    changeLocale: (locale: string) => void;
}

interface IState {
    locale: LocaleType;
}

export class App extends Component<BaseUIProps, IState> {
    constructor(props: BaseUIProps) {
        super(props);
        this.state = {
            locale: this.props.locale,
        };
    }

    setLocale(e: Event) {
        const value = (e.target as HTMLSelectElement).value as LocaleType;
        this.props.changeLocale(value);
        this.setState({
            locale: value,
        });
    }

    render() {
        const { context, UIConfig } = this.props;
        const { locale } = this.state;

        return (
            <AppContext.Provider
                value={{
                    context,
                    locale,
                }}
            >
                <div
                    style={{
                        position: 'fixed',
                        right: '200px',
                        top: '10px',
                        fontSize: '14px',
                        zIndex: 100,
                    }}
                >
                    <span
                        style={{
                            display: 'inline-block',
                            width: 50,
                            margin: '5px 0 0 5px',
                        }}
                    >
                        语言
                    </span>
                    <select value={locale} onChange={this.setLocale.bind(this)} style={{ width: 55 }}>
                        <option value="en">English</option>
                        <option value="zh">中文</option>
                    </select>
                </div>
                <SheetContainer {...UIConfig} />
            </AppContext.Provider>
        );
    }
}