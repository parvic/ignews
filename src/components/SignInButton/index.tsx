import { useState } from "react";
import { FaGithub } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import { useSession, signIn, signOut } from "next-auth/client";

import styles from "./styles.module.scss";

export function SignInButton() {
  const [session] = useSession();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return session ? (
    <button
      className={styles.buttonContainer}
      type="button"
      onClick={() => signOut()}
    >
      <FaGithub color="#04d361" />
      <span>{session.user.name}</span>
      <FiX className={styles.closeIcon} />
    </button>
  ) : (
    <button
      className={styles.buttonContainer}
      type="button"
      onClick={() => signIn("GitHub")}
    >
      <FaGithub color="#eba417" />
      <span>Sign in with GitHub</span>
      <FiX className={styles.closeIcon} />
    </button>
  );
}
