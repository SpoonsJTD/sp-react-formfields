import * as React from 'react';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import { ITermProps, ITermState } from './interfaces';

/**
 * Term component
 * Renders a selectable term
 */
export default class Term extends React.Component<ITermProps, ITermState> {
  constructor(props: ITermProps) {
    super(props);

    // Check if current term is selected
    let active = [];
    if (this.props.activeNodes) {
      active = this.props.activeNodes.filter(item => item.key === this.props.term.key);
    }

    this.state = {
      selected: active.length > 0
    };

    this._handleChange = this._handleChange.bind(this);
  }

  /**
   * Lifecycle event hook when component retrieves new properties
   * @param nextProps
   * @param nextContext
   */
  public componentWillReceiveProps?(nextProps: ITermProps, nextContext: any): void {
    // If multi-selection is turned off, only a single term can be selected
    if (!this.props.multiSelection) {
      let active = nextProps.activeNodes.filter(item => item.key === this.props.term.key);
      this.setState({ selected: active.length > 0 });
    }
  }

  /**
   * Default React render
   */
  public render(): JSX.Element {
    const styleProps: React.CSSProperties = {
      marginLeft: `${(this.props.term.pathDepth * 30)}px`
    };

    return (
      <div className={`${'listItem'} ${'term'}`} style={styleProps}>
        <Checkbox
          checked={this.state.selected}
          disabled={this.props.term.isDeprecated || this.props.disabled}
          className={this.props.term.isDeprecated ? `termDisabled` : `termEnabled`}
          label={this.props.term.name}
          onChange={this._handleChange} />
      </div>
    );
  }

  /**
   * Handle the checkbox change trigger
   */
  private _handleChange(ev: React.FormEvent<HTMLElement>, isChecked: boolean) {
    this.setState({
      selected: isChecked
    });
    this.props.changedCallback(this.props.term, isChecked);
  }
}
