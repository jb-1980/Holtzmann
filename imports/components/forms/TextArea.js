import { Component, PropTypes } from "react";
import ReactDOM from "react-dom";

import Label from "./components/Label";

export default class TextArea extends Component {


  state = {
    active: false,
    focused: false,
    error: false,
    status: "",
    value: null
  }

  componentWillMount(){
    if (this.props.defaultValue) {
      this.setState({ active: true });
    }
  }

  componentDidMount(){
    if (this.props.autofocus) {
      this.refs["apollos-input"].focus();
    }

    // if (this.props.defaultValue) {
    //   this.refs["apollos-input"].value = `${this.props.defaultValue}`
    // }

    // one day, I dream of a universal browser auto-fill event
    // until then. I'll keep on checking
    const target = ReactDOM.findDOMNode(this.refs["apollos-input"]);
    this.interval = setInterval(() => {

      if (this._previousValue === target.value || !target.value) {
        return;
      }

      if (!this._previousValue && target.value && !this.state.focused) {
        this.setValue(target.value);
      }

      this._previousValue = target.value;

    }, 20);

  }

  componentWillUpdate(nextProps){
    if (this.props.defaultValue != nextProps.defaultValue) {
      this.setValue(nextProps.defaultValue);
      this.setState({focused: false});
    }
  }

  componentWillUnmount(){
    if (this.interval) {
      clearInterval(this.interval);
    }
  }


  format = (e) => {

    const target = ReactDOM.findDOMNode(this.refs["apollos-input"]);
    let value = this.refs["apollos-input"].value;

    if (this.props.format && typeof(this.props.format) === "function") {

      const newValue = this.props.format(value, target, e);
      target.value = newValue;

    }

    if (this.props.onChange && typeof(this.props.onChange) === "function" ) {
      this.props.onChange(target.value, target, e);
    }

  }

  validate = (e) => {

    const target = ReactDOM.findDOMNode(this.refs["apollos-input"]);
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
        error: !this.props.validation(value, target, e)
      });
    }

    if (this.props.onBlur && typeof(this.props.onBlur) === "function") {
      this.props.onBlur(value, target, e);
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
    let node = ReactDOM.findDOMNode(this.refs["apollos-input"]);
    node.value = value;
    this.focus();
    this.validate();
  }

  getValue = () => {
    return ReactDOM.findDOMNode(this.refs["apollos-input"]).value;
  }


  setStatus = (message) => {
    this.props.status = message;
  }

  disabled = () => {
    if (this.props.disabled) {
      return this.props.disabled;
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


  style = () => {

    let style = {};

    if (this.props.style) {
      style = {...style, ...this.props.style};
    }

    if (this.props.disabled) {
      style = {...style, ...{
        cursor: "inherit"
      }};
    }

    return style;
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

    return (
      <div className={inputclasses.join(" ")} style={this.props.style || {}}>
        {(() => {
          if (!this.props.hideLabel){
            return (
              <Label
                  labelFor={
                  this.props.id || this.props.name || this.props.label
                }
                  labelName={
                  this.props.label || this.props.name
                }
                  disabed={this.disabled()}
              />
            );
          }
        })()}


        <textarea
            ref="apollos-input"
            id={this.props.id || this.props.name || this.props.label}
            type={this.props.type}
            placeholder={this.props.placeholder || this.props.label}
            name={this.props.name || this.props.label}
            className={this.props.inputClasses}
            disabled={this.disabled()}
            onBlur={this.validate}
            onFocus={this.focus}
            onChange={this.format}
            style={this.style()}
            rows={this.props.rows || 8}
            defaultValue={this.props.defaultValue}
        />

        {this.renderHelpText()}

      </div>
    );

  }

}
