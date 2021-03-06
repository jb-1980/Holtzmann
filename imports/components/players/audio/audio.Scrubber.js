
import { PropTypes, Component } from "react";
import { connect } from "react-redux";
import { css } from "aphrodite";

import Styles from "./audio.styles.scrubber";

import { actions as audioActions } from "../../../store/audio";

const mapStateToProps = (state) => {
  return state.audio;
};

@connect(mapStateToProps, audioActions)
export default class AudioScrubber extends Component {

  static propTypes = {
    isLight: PropTypes.bool.isRequired
  }

  state = {
    lastPercent: null,
    // This allows us to track if a user is scrubbing,
    // this way a click event doesn't also fire
    scrubbing: false,
    override: false
  }

  // Added cleanup methods for timeOut events
  componentWillUnmount() {
    if (this.onTouchEndTimeout) clearTimeout(this.touchEndTimeout);
    if (this.onClickTimeout) clearTimeout(this.onClickTimeout);
  }

  scrubStyle = () => {
    let { progress } = this.props;
    const { lastPercent, override } = this.state;

    if(override) {
      progress = lastPercent;
    }

    return {
      width: `${progress}%`
    };
  };

  touchMove = (e) => {
    const percent = this.calculatePercent(e.target, e.touches[0].clientX);

    this.setState({
      lastPercent: percent,
      // A scrub event is taking place, so we don't want a click event also
      scrubbing: true,
      override: true
    });
  };

  touchEnd = (e) => {
    const percent = this.state.lastPercent;

    if(typeof percent === "number") {
      this.seek(percent);
    };

    this.touchEndTimeout = setTimeout(() => {
      // Set states back to intial values so that time updates,
      // and click events will happen appropriatly.
      // Timeout is a full second as a shorter timeout did not
      // set this states properly.
      this.setState({
        scrubbing: false,
        override: false
      });
    }, 1000);
  }

  click = (e) => {
    // We are checking if a scrub is currently taking place,
    // as a onTouchEnd and Click event were both happening on scrub.
    const { scrubbing } = this.state;

    // If a user is scrubbing, don't execute the onClick event
    if(!scrubbing) {

      const percentClicked = this.calculatePercent(e.target, e.clientX);

      // Setting the state allows our time, and position to consistantly update.
      this.setState({
        lastPercent: percentClicked,
        override: true
      });

      this.seek(percentClicked);

      // We need to set the state back to it's initial value to allow incrementing
      // of the current time.
      // Timeout is a full second as a shorter timeout did not set the state appropriatly.
      this.onClickTimeout = setTimeout(() => {
        this.setState({
          override: false
        });
      }, 1000);

    }
  }

  calculatePercent = (targetElement, clickedX) => {
    var min = targetElement.offsetParent.offsetLeft;
    var range = targetElement.offsetWidth;
    var offsetClicked = clickedX - min;
    var percentClicked = offsetClicked / range * 100;

    if(percentClicked > 100) {
      percentClicked = 100;
    }
    else if(percentClicked < 0) {
      percentClicked = 0;
    }

    return percentClicked;
  }

  seek = (percentClicked) => {
    if(percentClicked > 100) {
      percentClicked = 100;
    }
    else if(percentClicked < 0) {
      percentClicked = 0;
    }

    this.props.seek(percentClicked);
  }

  getTertiaryBackgroundColor = (dark) => {
    return dark ? {backgroundColor: "rgba(255,255,255,.2)"} : {backgroundColor: "rgba(0,0,0,.2)"};
  };

  getTertiaryTextColor = (dark) => {
    return dark ? {color: "rgba(255,255,255,.5)"} : {color: "rgba(0,0,0,.5)"};
  };

  getSecondayBackgroundClass = (dark) => {
    return dark ? "background--dark-secondary" : "background--light-secondary";
  };

  getPrimaryBackgroundClass = (dark) => {
    return dark ? "background--dark-primary" : "background--light-primary";
  };

  getTertiaryTextClass = (dark) => {
    return dark ? "text-dark-tertiary" : "text-light-tertiary";
  };

  getTrackDuration = () => {
    return this.props.playing.track.duration;
  };

  getCurrentTime = () => {
    const { time } = this.props;
    return time;
  };

  render() {
    const { isLight } = this.props;

    const playbar = [
      "play-bar",
      "rounded",
      css(Styles["play-bar"]),
    ];

    return (
      <div className="grid one-whole flush soft-top">

        <div className="hard grid__item one-tenth floating__item " style={this.getTertiaryTextColor(!isLight)}>
          <small>
            <small>
              {this.getCurrentTime()}
            </small>
          </small>
        </div>

        <div
            className="grid__item eight-tenths push-half-ends floating__item soft-half-sides"
            style={{position: "relative"}}
            onTouchEnd={this.touchEnd}
            onTouchMove={this.touchMove}
            onClick={this.click}
        >
          <div
              className={playbar.join(" ")}
              style={this.getTertiaryBackgroundColor(!isLight)}
          />
          <div
              className={css(Styles["play-bar--active"]) + " floating--right"}
              style={this.scrubStyle()}
          >
            <div
                className={css(Styles["play-bar"]) + " " + "rounded " + this.getPrimaryBackgroundClass(isLight)}
            />
            <button
                className={css(Styles["scrub-dot"]) + " plain floating__item round " + this.getPrimaryBackgroundClass(isLight)}
            />
          </div>
          <div
              className="cover" style={{position: "absolute", top: "-20px", bottom: 0, left: 0, right: 0}}
          />
        </div>

        <div className="hard grid__item one-tenth floating__item " style={this.getTertiaryTextColor(!isLight)}>
          <small>
            <small>
              {this.getTrackDuration()}
            </small>
          </small>
        </div>

      </div>
    );
  }
}
