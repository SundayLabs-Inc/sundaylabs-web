"use client";
import { useId, useState } from "react";
import styles from "./HomeRentalPage.module.css";
export default function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return <div className={styles.faqItem}>
    <button type="button" className={styles.faqTrigger} aria-expanded={open} aria-controls={id} onClick={() => setOpen(value => !value)}>{question}<span aria-hidden="true" /></button>
    <div id={id} className={styles.faqAnswer} data-open={open} aria-hidden={!open} inert={!open}><div><p>{answer}</p></div></div>
  </div>;
}
