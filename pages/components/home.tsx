import Head from "next/head";
import { Component } from "react";
import styles from "../../styles/Home.module.css";

interface Props {
    toCreate: Function;
}

interface State {
  quoteIdx: number;
}

interface Quote {
  quote: String;
  author: String;
}

let quotes: Quote[] = [
  {
    quote:
      "Love is when the other person’s happiness is more important than your own.",
    author: "H. Jackson Brown, Jr.",
  },
  {
    quote:
      "Life is the flower for which love is the honey.",
    author: "Victor Hugo",
  },
  {
    quote:
      "To love and be loved is to feel the sun from both sides.",
    author: "David Viscott",
  },
];

export default class Home extends Component<Props, State> {

  state : State = {
    quoteIdx: -1
  }

  constructor(props: Props) {
    super(props);
  }

  componentDidMount() {
    this.setState({quoteIdx: Math.floor(Math.random() * quotes.length)});
  }

  getQuote() {
    const { quoteIdx } = this.state;
    if (quoteIdx > -1) {
      return <div>
        <p className={styles.tagline}> {quotes[quoteIdx].quote} </p>
        <p className={styles.tagline_author}> - {quotes[quoteIdx].author} </p>

        </div>;
    }
    return <div/>;
  }

  render() {
    return (
        <div className={styles.main_content}>
          <h1 className={styles.title}> Heartbeat </h1>
          {this.getQuote()}
          <button className={styles.create_button} onClick={() => this.props.toCreate()}> Create </button>
        </div>
    );
  }
}
