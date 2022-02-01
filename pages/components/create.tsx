import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { Component } from "react";
import styles from "../../styles/Home.module.css";

const axios = require("axios");

interface Props {
  toHome: Function;
}

interface State {
  message: string;
  passphraseOn: boolean;
  viewOnce: boolean;
  passphrase: string;
  recipient: string;
  error: string;
  heartbeat: any;
}

export default class Create extends Component<Props, State> {
  state: State = {
    message: "",
    passphraseOn: false,
    viewOnce: true,
    passphrase: "",
    recipient: "",
    error: "",
    heartbeat: null
  };

  constructor(props: Props) {
    super(props);
  }

  create() {
    const { message, recipient, passphrase, viewOnce } = this.state;
    axios({
      method: "post",
      url: "/api/add_message",
      data: { message, recipient, passphrase, oneTime: viewOnce },
    })
      .then((response: any) => {
        if (response.data) {
          this.setState({heartbeat: response.data.heart});
        }
      })
      .catch((error: any) => {
        if (error.response) {
          this.setState({ error: error.response.data.error });
        } else {
          this.setState({ error: "Sorry, an unknown error has occured" });
        }
      });
  }

  render() {
    const { message, viewOnce, passphraseOn, passphrase, recipient, error, heartbeat } =
      this.state;

    if (heartbeat) {
      return <div className={styles.main_content}>
        <h1 className={styles.title}> Heartbeat </h1>
        <p style={{ marginTop: "8px" }} className={styles.text}>
          Your heartbeat {heartbeat.recipient ? `for ${heartbeat.recipient} ` : ""}has been generated!
        </p>
        <p style={{ marginTop: "8px" }} className={styles.text}>
          It&apos;s code is {heartbeat.code}
        </p>
        <button style={{marginTop: "8px"}} className={styles.create_button} onClick={() => navigator.clipboard.writeText(window.location.href + heartbeat.code)}>
          Copy Link
        </button>
      </div>
    }

    return (
      <div className={styles.main_content}>
        <FontAwesomeIcon
          icon={faArrowLeft}
          className={styles.back_button}
          onClick={() => this.props.toHome()}
        />
        <h1 className={styles.title}> Heartbeat </h1>
        <p style={{ marginTop: "8px" }} className={styles.error_text}>
          {error}
        </p>

        <p style={{ marginTop: "16px" }} className={styles.text}>
          Who do you want to send your message to?
        </p>
        <input
          className={styles.text_input}
          value={recipient}
          placeholder={"Their name or any special nicknames"}
          onChange={(e) => this.setState({ recipient: e.target.value })}
        />

        <p style={{ marginTop: "8px" }} className={styles.text}>
          What do you want your Heartbeat to say?
        </p>
        <textarea
          autoCorrect={"off"}
          className={styles.message_box}
          value={message}
          placeholder={"Your message to your loved one goes here!"}
          onChange={(e) => this.setState({ message: e.target.value })}
        />

        <div className={styles.checkbox_row}>
          <label className={styles.checkbox_container}>
            <input
              type="checkbox"
              checked={passphraseOn}
              onChange={(e) =>
                this.setState({ passphraseOn: e.target.checked })
              }
            />
            <div className={styles.checkmark}></div>
          </label>

          <p className={styles.text}> Secret Passphrase? </p>
        </div>

        <input
          className={styles.text_input}
          value={passphrase}
          style={{ display: passphraseOn ? "initial" : "none" }}
          placeholder={"A special day or song works great!"}
          onChange={(e) => this.setState({ passphrase: e.target.value })}
        />

        <div className={styles.checkbox_row}>
          <label className={styles.checkbox_container}>
            <input
              type="checkbox"
              checked={viewOnce}
              onChange={(e) => this.setState({ viewOnce: e.target.checked })}
            />
            <div className={styles.checkmark}></div>
          </label>

          <p className={styles.text}> Delete after viewing? </p>
        </div>

        <button className={styles.create_button} onClick={() => this.create()}>
          Create
        </button>
      </div>
    );
  }
}
