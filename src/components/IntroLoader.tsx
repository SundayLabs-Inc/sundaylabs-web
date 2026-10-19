"use client";

import { useEffect, useState } from "react";
import { INTRO_DONE_EVENT } from "@/constants/events";
const STORAGE_KEY = "ashitano-intro-seen";

function notifyIntroDone() {
  window.dispatchEvent(new Event(INTRO_DONE_EVENT));
}

export default function IntroLoader() {
  const [visible, setVisible] = useState(true);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Intro overlay delays / blocks muted autoplay on mobile Safari.
    const isCoarse =
      window.matchMedia("(max-width: 1023px), (pointer: coarse)").matches;

    if (
      isCoarse ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setVisible(false);
      notifyIntroDone();
      return;
    }

    try {
      if (sessionStorage.getItem(STORAGE_KEY) === "1") {
        setVisible(false);
        notifyIntroDone();
        return;
      }
    } catch {
      // ignore
    }

    const hide = window.setTimeout(() => {
      setDone(true);
      try {
        sessionStorage.setItem(STORAGE_KEY, "1");
      } catch {
        // ignore
      }
      notifyIntroDone();
    }, 1400);

    const remove = window.setTimeout(() => setVisible(false), 2300);

    return () => {
      window.clearTimeout(hide);
      window.clearTimeout(remove);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`intro-loader${done ? " is-done" : ""}`}
      aria-hidden="true"
    >
      <div className="intro-brand">
        <img src="/images/logo-mark.png" alt="" />
      </div>
    </div>
  );
}
