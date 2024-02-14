"use client";
import { createUserWithEmailAndPassword } from "firebase/auth";
import styles from "../page.module.css";
import { useContext, useRef } from "react";
import { auth } from "@/firebase/config";
import { useRouter } from "next/navigation";
import { AuthContext } from "../context/AuthContext";
import Link from "next/link";
import classes from "./signup.module.css";

const Signup: React.FC = () => {
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const user = useContext(AuthContext);

  if (user) router.push("/tracker");

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    const email = emailInputRef.current?.value;
    const password = passwordInputRef.current?.value;
    createUserWithEmailAndPassword(auth, email as string, password as string)
      .then((userCredential) => {
        router.push("/tracker");
      })
      .catch((error) => {
        console.log(`${error.message} - Code is ${error.code}`);
      });
  }

  return (
    !user && (
      <div className={styles.container}>
        <div className={classes.signup}>
          <p className={styles.heading}>Expenses Tracker</p>
          <form className={styles.loginForm}>
            <input
              type="email"
              placeholder="xyz@email.com"
              ref={emailInputRef}
            />
            <input
              type="password"
              placeholder="password"
              ref={passwordInputRef}
            />
            <button onClick={handleSignup} type="submit">
              $SIGNUP
            </button>
          </form>
          <div className={styles.signUp}>
            Signed up?
            <Link href="/">
              <button type="submit">Login</button>
            </Link>
          </div>
        </div>
      </div>
    )
  );
};

export default Signup;
