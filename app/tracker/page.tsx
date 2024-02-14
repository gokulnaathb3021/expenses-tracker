"use client";
import { auth, db } from "@/firebase/config";
import { signOut } from "firebase/auth";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useRouter, redirect } from "next/navigation";
import styles from "./tracker.module.css";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

const Tracker: React.FC = () => {
  const user = useContext(AuthContext);
  const router = useRouter();
  if (!user) redirect("/");

  const expenseNameInputRef = useRef<HTMLInputElement>(null);
  const spentInputRef = useRef<HTMLInputElement>(null);

  async function handleAddExpense(e: React.FormEvent) {
    e.preventDefault();
    const expenseName = expenseNameInputRef.current?.value;
    const spent = spentInputRef.current?.value;
    if (expenseName != "" && spent != "") {
      await addDoc(collection(db, "expenses"), {
        email: user?.email as string,
        expenseName,
        price: spent,
      });
      expenseNameInputRef.current!.value = "";
      spentInputRef.current!.value = "";
    }
  }

  type Expense = {
    price: string;
    expenseName: string;
    id: string;
  };

  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [expenses, setExpenses] = useState<Expense[] | null>(null);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    if (expenses === null) setIsFetching(true);
    const q = query(
      collection(db, "expenses"),
      where("email", "==", user!.email as string)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let expensesArr: Expense[] = [];
      querySnapshot.forEach((doc) => {
        const expense: Expense = { ...doc.data(), id: doc.id } as Expense;
        expensesArr.push(expense);
      });
      if (expensesArr.length === 0) {
        setExpenses(null);
      } else {
        setExpenses(expensesArr);
      }
      let totalExpense = 0;
      for (let i = 0; i < expensesArr.length; i += 1)
        totalExpense += parseInt(expensesArr[i].price);
      setTotal(totalExpense);
      setIsFetching(false);
    });
    return () => unsubscribe();
  }, []);

  async function deleteExpense(id: string) {
    await deleteDoc(doc(db, "expenses", id));
  }

  return (
    user && (
      <div className={styles.trackerPage}>
        <h1 className={styles.heading}>Expenses Tracker</h1>
        <div className={styles.formAndExpenses}>
          <form className={styles.form}>
            <input
              type="text"
              placeholder="Expense name"
              ref={expenseNameInputRef}
            />
            <input
              type="number"
              placeholder="Rs."
              name="price"
              ref={spentInputRef}
            />
            <button
              type="submit"
              className={styles.addButton}
              onClick={handleAddExpense}
            >
              +
            </button>
          </form>
          {isFetching && (
            <p className={styles.fetching}>Fetching expenses...</p>
          )}
          {expenses?.map((expense) => (
            <div key={expense.id} className={styles.expense}>
              <span>{expense.expenseName}</span>
              <div className={styles.priceAndDelete}>
                <span>{expense.price}</span>
                <button onClick={() => deleteExpense(expense.id)}>X</button>
              </div>
            </div>
          ))}
          {expenses === null && (
            <p className={styles.fetching}>You don't have any expenses yet.</p>
          )}
          {expenses !== null && (
            <div className={styles.total}>
              <span>Total expense:</span>
              <span>{total} Rs.</span>
            </div>
          )}
          <button onClick={() => signOut(auth)} className={styles.logout}>
            Logout
          </button>
        </div>
      </div>
    )
  );
};

export default Tracker;
