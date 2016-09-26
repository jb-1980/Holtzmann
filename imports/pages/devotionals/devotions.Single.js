import { Component } from "react";
import ReactMixin from "react-mixin";
import { connect } from "react-apollo";
import gql from "graphql-tag";
import SwipeViews from "react-swipe-views";

import Loading from "../../components/loading";

import Likeable from "../../mixins/mixins.Likeable";
import Shareable from "../../mixins/mixins.Shareable";

import {
  nav as navActions,
  header as headerActions,
  live as liveActions,
} from "../../store";

// can we use the core toggle here? Is it ready @jbaxleyiii?
import DevotionsSingleContent from "./devotions.SingleContent";
import DevotionsSingleScripture from "./devotions.SingleScripture";

const DEVOTION_QUERY = gql `
  query getDevotional($id: ID!) {
    content: node(id: $id) {
      id
      ... on Content {
        entryId: id
        title
        status
        channelName
        meta {
          urlTitle
          siteId
          date
          channelId
        }
        content {
          body
          tags
          scripture {
            book
            passage
          }
          images(sizes: ["large"]) {
            fileName
            fileType
            fileLabel
            url
          }
        }
      }
    }
  }
`;


const withDevotion = graphql(DevotionQuery, {
    options: (ownProps) => ({
      variables: {id: ownProps.params.id},
      returnPartialData: false,
    })
})


const mapStateToProps = (state) => ({
  modal: { visible: state.modal.visible },
  live: state.live,
});

@connect({ mapQueriesToProps, mapStateToProps })
@withDevotion
@ReactMixin.decorate(Likeable)
@ReactMixin.decorate(Shareable)
export default class SeriesSingle extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    live: PropTypes.object.isRequired,
    devotion: PropTypes.object.isRequired,
  }

  state = { selectedIndex: 0 }

  componentWillMount() {
    if (process.env.WEB) return;

    // hide the live bar and then bring it back
    // after the view has faded in. this prevents
    // an issue with the z-index and the arrow
    // from the header.
    this.props.dispatch(liveActions.hide());
    // for cached data
    this.handleLiveBar(this.props, this.state);

    this.props.dispatch(navActions.setLevel("CONTENT"));
    this.props.dispatch(navActions.setAction("CONTENT", {
      id: 2,
      action: this.likeableAction,
    }));

    this.props.dispatch(headerActions.set({}));
    this.props.dispatch(headerActions.hide());
  }

  componentWillUpdate(nextProps, nextState) {
    this.handleLiveBar(nextProps, nextState);
  }

  componentWillUnmount() {
    if (process.env.WEB) return;
    this.props.dispatch(liveActions.unfloat());
  }

  onClickLink = (event) => {
    event.preventDefault();
    this.setState({
      selectedIndex: 1,
      liveSet: false,
      livePush: false,
    });
  }

  getLiveClasses = () => {
    const classes = [];
    if (this.props.live.live && this.state.livePush) {
      classes.push("push-double-top");
    }

    return classes;
  }

  // if has scripture and live re-enabled
  // the live bar
  // else apply float styles to the bar so it
  // will display below the fixed header
  handleLiveBar = (props, state) => {
    const { liveSet } = state;
    const { content } = props.devotion;
    const { live } = props.live;

    if (liveSet || !live || !content) return;

    this.setState({
      liveSet: true,
    });

    if (content.content.scripture) {
      this.props.dispatch(liveActions.float());
      setTimeout(() => {
        this.setState({
          livePush: true,
        });
        this.props.dispatch(liveActions.show());
      }, 1000);
    } else {
      setTimeout(() => {
        this.props.dispatch(liveActions.show());
      }, 1000);
    }
  }

  renderContent = (devotion) => {
    if (!devotion.content.scripture) {
      return (
        <div title="Devotional">
          <DevotionsSingleContent
            devotion={devotion}
            onClickLink={this.onClickLink}
            classes={this.getLiveClasses()}
          />
        </div>
      );
    }

    return (
      <SwipeViews
        selectedIndex={this.state.selectedIndex}
        disableSwipe
      >

        <div title="Devotional">
          <DevotionsSingleContent
            devotion={devotion}
            onClickLink={this.onClickLink}
            classes={this.getLiveClasses()}
          />
        </div>

        <div title="Scripture">
          <DevotionsSingleScripture
            devotion={devotion}
            classes={this.getLiveClasses()}
          />
        </div>
      </SwipeViews>
    );
  }

  render() {
    const { content } = this.props.devotion;
    if (!content) {
      return (
        <div className="locked-ends locked-sides floating">
          <div className="floating__item">
            <Loading />
          </div>
        </div>
      );
    }

    const devotion = content;

    return (
      <div>
        {this.renderContent(devotion)}
      </div>
    );
  }

}
