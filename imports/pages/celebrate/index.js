import { Component, PropTypes } from "react";
import { connect } from "react-redux";

import { header as headerActions } from "../../store";

import Meta from "../../components/meta";
import Intro from "./intro/index";

import Salvation from "./salvation/index";
import Baptism from "./baptism/index";
import CareRoom from "./care-room/index";
import Serving from "./serving/index";
import KidSpring from "./kidspring/index";
import Fuse from "./fuse/index";
import GauntletX from "./gauntlet-x/index";
import FloodSCWithLove from "./flood-sc-with-love/index";
import ClemsonForChristmas from "./clemson-for-christmas/index";
import Missions from "./missions/index";
import Web from "./web/index";
import SocialMedia from "./social-media/index";
import NewSpringNetwork from "./newspring-network/index";

import Closing from "./closing/index";

@connect()
class Template extends Component {
  componentDidMount(){
    if (process.env.NATIVE) {
      const item = {
        title: "Annual Report",
      };

      this.props.dispatch(headerActions.set(item));
    }

  }

  render () {
    return (
      <div>
        <Meta title="Annual Report" />

        <Intro />

        <Salvation />
        <Baptism />
        <CareRoom />
        <Serving />

        <KidSpring />
        <Fuse />
        <GauntletX />

        <FloodSCWithLove />

        <ClemsonForChristmas />

        <Missions />

        <Web />
        <SocialMedia />
        <NewSpringNetwork />

        <Closing />
      </div>

    );
  }
}


const Routes = [
  {
    path: "/celebrate",
    component: Template,
  },
];

export default {
  Template,
  Routes
};
