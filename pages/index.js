import cookies from "next-cookies";
import withRedux from "next-redux-wrapper";
import Head from "next/head";
import React from "react";
import { track } from "../lib/analytics";
import fb from "../lib/analytics/fb";
import ga from "../lib/analytics/ga";
import headerTextExperiment from "../lib/headerText";
import { initStore } from "../lib/initRedux";
import { startExperiment } from "../lib/redux/reducers/experiments";
import { signupLead } from "../lib/redux/reducers/lead";
import SignUpForm from "../components/SignUpForm";

class Index extends React.Component {
  static getInitialProps(ctx) {
    const { store } = ctx;
    const dispatchStartExperiment = ({ name, variant }) => {
      console.log("starting experiment");

      store.dispatch(startExperiment({ name, variant }));
    };

    const activeExperiments = [headerTextExperiment];

    headerTextExperiment.once("variant.selected", dispatchStartExperiment);

    let { userId } = cookies(ctx);
    activeExperiments.forEach(experiment => experiment.start({ userId }));
  }

  componentDidMount() {
    const { experiments } = this.props;

    if (experiments.active[headerTextExperiment.name]) {
      let analytics = startExperiment({
        name: headerTextExperiment.name,
        variant: experiments.active[headerTextExperiment.name]
      }).meta.analytics;

      track({ event: analytics.event, value: analytics.value });
    }
  }

  render() {
    const { experiments, lead, signupLead } = this.props;
    return (
      <div>
        <Head>
          <title>SSR Split Tests</title>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
          />
          <script dangerouslySetInnerHTML={{ __html: ga }} />
          <script dangerouslySetInnerHTML={{ __html: fb }} />
        </Head>
        {experiments.active[headerTextExperiment.name] === "control"
          ? "Welcome to Next.js!"
          : null}

        {experiments.active[headerTextExperiment.name] === "mine"
          ? "Welcome to MY Next.js!"
          : null}
        <SignUpForm lead={lead} signup={signupLead} />
      </div>
    );
  }
}

const mapStateToProps = ({ experiments, lead }) => ({ experiments, lead });
const mapDispatchToProps = (dispatch, ownProps) => ({
  signupLead: ({ email }) => {
    dispatch(signupLead({ email }));
  }
});

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(Index);
