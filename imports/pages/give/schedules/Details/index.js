import { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { graphql } from "react-apollo";
import gql from "graphql-tag";

import {
  nav as navActions,
  modal as modalActions,
  give as giveActions,
  header as headerActions,
} from "../../../../store";

import Confirm from "./Confirm";
import Layout from "./Layout";

const ENTRIES_QUERY = gql`
  query GetTaggedContent($tagName: String!, $limit: Int, $includeChannels: [String]) {
    entries: taggedContent(
      tagName: $tagName,
      limit: $limit,
      includeChannels: $includeChannels
    ) {
      entryId: id
      title
      channelName
      status
      meta { summary, urlTitle }
      content { images(sizes: ["large"]) { fileName, fileType, fileLabel, url } }
    }
  }
`;

const withEntries = graphql(ENTRIES_QUERY, {
  name: "entries",
  options: {
    variables: {
      tagName: "giving",
      limit: 2,
      includeChannels: ["articles"],
    },
  },
});

const GET_SCHEDULE_TRANSACTION_QUERY = gql`
  query GetScheduleTransaction($scheduleTransactionId: ID!) {
    transaction: node(id: $scheduleTransactionId) {
      ... on ScheduledTransaction {
        numberOfPayments
        next
        end
        id: entityId
        reminderDate
        gateway
        start
        date
        details { amount, account { name, description } }
        payment { paymentType, accountNumber, id }
        schedule { value, description }
        transactions {
          id
          date
          status
          summary
          person { firstName, lastName, photo }
          details { id, amount, account { id, name } }
        }
      }
    }
  }
`;

const withGetScheduleTransaction = graphql(GET_SCHEDULE_TRANSACTION_QUERY, {
  options: ownProps => ({
    variables: { scheduleTransactionId: ownProps.params.id },
    forceFetch: true,
  }),
});

@connect()
@withEntries
@withGetScheduleTransaction
export default class Details extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    data: PropTypes.shape({
      loading: PropTypes.bool,
      transaction: PropTypes.object,
    }),
    entries: PropTypes.object,
  }

  state = {
    isActive: true,
    removed: null,
  }

  componentWillMount() {
    this.props.dispatch(navActions.setLevel("BASIC_CONTENT"));
  }

  componentDidMount() {
    if (process.env.NATIVE) {
      const item = { title: "Schedule Details" };
      this.props.dispatch(headerActions.set(item));
    }
  }

  componentWillUnmount() {
    this.props.dispatch(navActions.setLevel("TOP"));
    if (this.state.removed) {
      this.props.dispatch(giveActions.deleteSchedule(this.state.removed));
    }
  }


  stop = (e) => {
    e.preventDefault();

    this.props.dispatch(modalActions.render(Confirm, {
      onFinished: () => {
        const { id, gateway } = this.props.data.transaction;

        this.setState({ isActive: false, removed: id });
        Meteor.call("give/schedule/cancel", { id, gateway }, () => {
        });
      },
    }));
  }

  render() {
    let complete = false;
    let { transaction } = this.props.data;
    if (!transaction) {
      transaction = false;
    }
    if (new Date(transaction.next) < new Date() && transaction.schedule.value === "One-Time") {
      complete = true;
    }

    const { entries, loading } = this.props.entries;

    return (
      <Layout
        stop={this.stop}
        schedule={transaction}
        ready={!this.props.data.loading}
        state={this.state}
        active={this.state.isActive}
        complete={complete}
        entries={entries}
        loadingEntries={loading}
      />
    );
  }
}
