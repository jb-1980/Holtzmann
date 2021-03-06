import { Component } from "react";
import ReactMixin from "react-mixin";
import { connect } from "react-apollo";
import Meta from "react-helmet";
import gql from "graphql-tag";

// loading state
import Split, { Left, Right } from "../../blocks/split";
import Headerable from "../../mixins/mixins.Header";
import Likeable from "../../mixins/mixins.Likeable";
import Shareable from "../../mixins/mixins.Shareable";

import Loading from "../../components/loading";

// import editorial collection for lookup
import backgrounds from "../../util/backgrounds";
import RelatedContent from "../../blocks/content/RelatedContent";

import SingleVideoPlayer from "../../components/players/video/Player";

import { linkListener } from "../../util/inAppLink";

import {
  nav as navActions
} from "../../store";

// import content component
import Content from "./articles.Content";

const mapQueriesToProps = ({ ownProps, state }) => ({
  article: {
    query: gql`
      query getArticle($id: ID!) {
        content: node(id: $id) {
          id
          ... on Content {
            title
            status
            channelName
            authors
            meta {
              urlTitle
              siteId
              date
              channelId
            }
            content {
              body
              ooyalaId
              tags
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
    `,
    variables: { id: ownProps.params.id },
    forceFetch: false,
    returnPartialData: false, // XXX can this be true?
  },
});

const defaultArray = [];
@connect({ mapQueriesToProps })
@ReactMixin.decorate(Likeable)
@ReactMixin.decorate(Shareable)
@ReactMixin.decorate(Headerable)
export default class ArticlesSingle extends Component {

  componentWillMount(){
    if (process.env.WEB) return;
    this.props.dispatch(navActions.setLevel("CONTENT"));
    this.props.dispatch(navActions.setAction("CONTENT", {
      id: 2,
      action: this.likeableAction
    }));

  }

  render() {
    const { content } = this.props.article;

    if (!content) {
      // loading
      return (
        <div className="locked-ends locked-sides floating">
          <div className="floating__item">
            <Loading/>
          </div>
        </div>
      );
    }

    const article = content;
    let photo = backgrounds.image(article);
    return (
      <div>
        <Split nav classes={["background--light-primary"]}>
          {(() => {
            if (article.content.ooyalaId.length === 0) {
              return (
                <Right
                    mobile
                    background={photo}
                    classes={["floating--bottom", "overlay--gradient@lap-and-up"]}
                    ratioClasses={["floating__item", "overlay__item", "one-whole", "soft@lap-and-up"]}
                    aspect="square"
                />
              );
            } else {
              return <SingleVideoPlayer ooyalaId={article.content.ooyalaId} />;
            }
          })()}
        </Split>
        <Left scroll >
          <div className="one-whole">
            <section className="soft@palm soft-double-sides@palm-wide-and-up soft@lap soft-double@lap-wide-and-up push-top push-double-top@lap-and-up">
              <Content article={article} />
            </section>
            <RelatedContent excludedIds={[article.id]} tags={article.content.tags || defaultArray} />
          </div>
        </Left>
      </div>
    );
  }
}
