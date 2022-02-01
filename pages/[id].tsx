import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/dist/client/router";
import { useEffect, useState } from "react";
import Link from "next/link";

const axios = require("axios");

type Heart = {
  id: number;
  message: string;
  viewed: number;
  code: string;
  passphrase: string;
  oneTime: number;
  recipient: string;
};

function useQuery() {
  const router = useRouter();
  const hasQueryParams =
    /\[.+\]/.test(router.route) || /\?./.test(router.asPath);
  const ready = !hasQueryParams || Object.keys(router.query).length > 0;
  if (!ready) return null;
  return router.query;
}

export default function Word() {
  const query = useQuery();

  const [heart, setHeart] = useState<Heart | null>(null);
  const [error, setError] = useState("Loading...");
  const [passphrase, setPassprase] = useState("");

  const [needsPassphrase, setNeedsPassphrase] = useState(false);
  const [submit, setSubmit] = useState(false);

  useEffect(() => {
    if (!query) {
      return;
    }
    const { id } = query;
    axios({
      method: "post",
      url: "/api/get_message",
      data: { code: id, passphrase },
    })
      .then(function (response: any) {
        if (response.data) {
          setError("");
          setHeart(response.data.heart);
          setNeedsPassphrase(false);
        }
      })
      .catch(function (error: any) {
        if (error.response) {
          setError(error.response.data.error);
          if (error.response.status == 403) {
            setNeedsPassphrase(true);
          }
        } else {
          setError(
            "I'm sorry! We couldn't find the heartbeat you're looking for."
          );
        }
      });
    setSubmit(false);
  }, [query, submit]);

  return (
    <div className={styles.full_page}>
      <Head>
        <title>Heartbeat</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className={styles.main_content}>
        <p className={styles.text}> {error} </p>
        {needsPassphrase ? (
          <div>
            <input
              maxLength={32}
              className={styles.text_input}
              type="password"
              value={passphrase}
              onChange={(e) => setPassprase(e.target.value)}
            />
            <button
              className={styles.create_button}
              onClick={() => setSubmit(true)}
            >
              Submit
            </button>
          </div>
        ) : (
          <div />
        )}
        {heart ? (
          <div>
            {heart?.recipient && heart?.recipient != "0" ? (
              <p className={styles.text_from}> To {heart?.recipient} </p>
            ) : (
              <div />
            )}
            <p
              style={{
                marginTop: "8px",
                height: "100px",
                maxHeight: "250px",
                overflowY: "auto",
              }}
              className={styles.text_normal}
            >
              {heart?.message}
            </p>
            <Link href="/">
              <button
                style={{
                  marginTop: "24px",
                  padding: "6px 12px",
                  fontSize: "1em",
                }}
                className={styles.create_button}
              >
                Create Your Own Heartbeat
              </button>
            </Link>
          </div>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
