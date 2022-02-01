import Head from "next/head";
import { Component } from "react";
import styles from "../styles/Home.module.css";
import Create from "./components/create";
import Home from "./components/home";

interface Props {}

interface State {
  page: number;
}

export default class Index extends Component<Props, State> {
  state: State = {
    page: 0,
  };

  constructor(props: Props) {
    super(props);
  }

  componentDidMount() {}

  getPage() {
    switch (this.state.page) {
      case 0:
        return <Home toCreate={() => this.setState({ page: 1 })} />;
      case 1:
        return <Create toHome={() => this.setState({ page: 0 })} />;
    }
  }

  render() {
    return (
      <div className={styles.full_page}>
        <Head>
          <title>Heartbeat</title>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>
        {this.getPage()}
      </div>
    );
  }
}
