import { Component, PropTypes } from "react";
import ReactDOM from "react-dom";
import { css } from "aphrodite";
// import ReactSelect from "react-select";

import Label from "./components/Label";

import SelectClasses from "./select-css";

export default class Select extends Component {

  state = {
    active: false,
    focused: false,
    error: false,
    status: ""
  }

  componentWillMount(){
    if (this.props.defaultValue) {
      this.setState({ active: true });

    }
  }

  componentDidMount(){
    if (this.props.defaultValue) {
      const target = ReactDOM.findDOMNode(this.refs["apollos-select"]);

      if (this.props.onChange) {
        this.props.onChange(this.props.defaultValue, target);
      }

      if (this.props.validation) {
        this.props.validation(this.props.defaultValue, target);
      }
    }
  }

  componentWillUpdate(nextProps){
    if (this.props.defaultValue != nextProps.defaultValue) {
      this.setValue(nextProps.defaultValue);
      this.setState({focused: false});
      const target = ReactDOM.findDOMNode(this.refs["apollos-select"]);
      this.change({
        value: nextProps.defaultValue,
        id: target.id,
        currentTarget: target
      });
    }
  }

  focus = (event) => {
    this.setState({
      active: true,
      error: false,
      focused: true
    });
  }

  setValue = (value) => {
    let node = ReactDOM.findDOMNode(this.refs["apollos-select"]);
    node.value = value;
    this.focus();
    // this.change()
  }

  getValue = () => {
    return ReactDOM.findDOMNode(this.refs["apollos-select"]).value;
  }


  setStatus = (message) => {
    this.props.status = message;
  }

  disabled = () => {
    if (this.props.disabled) {
      return disabled;
    }
  }

  renderHelpText = (message) => {

    if ((this.state.error && this.props.errorText) || this.state.status) {

      return (
        <span className="input__status">
          {this.props.errorText || this.state.status}
        </span>
      );
    }

  }

  change = (e) => {
    const { id, value } = e.currentTarget;
    const target = ReactDOM.findDOMNode(this.refs["apollos-select"]);

    if (this.props.onChange) {
      this.props.onChange(value, e.currentTarget);
    }

    if (this.props.validation) {
      this.props.validation(value, e.currentTarget);
    }

  }

  validate = () => {
    const target = ReactDOM.findDOMNode(this.refs["apollos-select"]);
    const value = target.value;

    if (!value) {
      this.setState({
        active: false,
        error: false
      });
    }

    this.setState({
      focused: false
    });

    if (this.props.validation && typeof(this.props.validation) === "function") {
      this.setState({
        error: !this.props.validation(value, target)
      });

    }
  }



  render() {

    let inputclasses = [
      "input"
    ];

    // theme overwrite
    if (this.props.theme) { inputclasses = this.props.theme }
    // state mangaged classes
    if (this.state.active) { inputclasses.push("input--active") }
    if (this.state.focused) { inputclasses.push("input--focused") }
    if (this.state.error) { inputclasses.push("input--alert") }
    // custom added classes
    if (this.props.classes) { inputclasses = inputclasses.concat(this.props.classes) }

    if (this.props.selected) { inputclasses.push("input--active") }
    return (
      <div className={inputclasses.join(" ") + ` ${css(SelectClasses.select)}`}>
        {(() => {
          if (!this.props.hideLabel){
            return (
              <Label
                  labelFor={
                  this.props.id || this.props.label || this.props.name
                }
                  labelName={
                  this.props.label || this.props.name
                }
              />
            );
          }
        })()}

        <select
            ref="apollos-select"
            id={this.props.id || this.props.label || this.props.name}
            placeholder={this.props.placeholder || this.props.label}
            name={this.props.name || this.props.label}
            className={this.props.inputClasses}
            disabled={this.disabled()}
            onFocus={this.focus}
            onChange={this.change}
            defaultValue={this.props.defaultValue}
            value={this.props.selected}

        >
          {(() => {
            if (this.props.placeholder || this.props.includeBlank) {
              return (
                <option style={{display:"none"}}>{this.props.placeholder || ""}</option>
              );
            }
          })()}
          {(() => {
            if (this.props.deselect) {
              return (
                <option />
              );
            }
          })()}
          {this.props.items.map((option, key) => {
            return (
              <option
                  className={this.props.optionClasses}
                  value={option.value  || option.label}
                  key={key}
              >
                {option.label || option.value}
              </option>
            );
          })}
        </select>



        {this.renderHelpText()}

      </div>
    );

  }

}
