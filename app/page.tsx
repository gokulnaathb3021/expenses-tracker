"use client";
import Link from "next/link";
import styles from "./page.module.css";
import { useContext, useRef, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/config";
import { useRouter, redirect } from "next/navigation";
import { AuthContext } from "./context/AuthContext";
export default function Home() {
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const [areCredentialsInvalid, setAreCredentialsInvalid] =
    useState<boolean>(false);
  const router = useRouter();
  const user = useContext(AuthContext);

  if (user) redirect("/tracker");

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const email = emailInputRef.current?.value;
    const password = passwordInputRef.current?.value;
    signInWithEmailAndPassword(auth, email as string, password as string)
      .then((userCredential) => redirect("/tracker"))
      .catch((error) => {
        setAreCredentialsInvalid(true);
        console.log(`${error.message} - Code is ${error.code}`);
      });
  }
  return (
    !user && (
      <div className={styles.container}>
        <div className={styles.login}>
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
            <button type="submit" onClick={handleLogin}>
              $LOGIN
            </button>
          </form>
          {areCredentialsInvalid && (
            <p className={styles.invalid}>Invalid credentials!</p>
          )}
          <div className={styles.signUp}>
            New user?
            <Link href="/signup">
              <button type="submit">Sign up</button>
            </Link>
          </div>
        </div>
      </div>
    )
  );
}
