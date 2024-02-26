// "use server";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth, db } from "../../../firebase.config";
import { doc, setDoc } from "firebase/firestore";
import { chi } from "@/lib/chimoney";

const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "localhost:3000"
    : "https://chi-orpin.vercel.app";

export async function signIn(email: string, password: string) {
  try {
    const user = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await user.user.getIdToken();

    const response = await fetch("/api/auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idToken }),
    });

    const res = await response.json();

    if (response.ok && res.success) {
      return true;
    } else return false;
  } catch (err) {
    console.log(err);
    return false;
  }
}

export async function signInGoogle() {
  try {
    const provider = new GoogleAuthProvider();

    const user = await signInWithPopup(auth, provider);
    const idToken = await user.user.getIdToken();

    const response = await fetch("/api/auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idToken }),
    });

    const res = await response.json();

    if (response.ok && res.success) {
      return true;
    } else return false;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export async function createWithGoogle() {
  try {
    const provider = new GoogleAuthProvider();

    const user = await signInWithPopup(auth, provider);

    let data = {
      email: user.user.email,
      name: user.user.displayName,
      photoUrl: user.user.photoURL,
      uid: user.user.uid,
      isAdmin: false,
    };
    const userRef = doc(db, "users", user.user.uid);

    const id = await chi("/sub-account/create", {
      body: {
        name: data.name,
        email: data.email,
        firstName: data?.name?.split(" ")[0],
        lastName: data?.name?.split(" ")[1],
        meta: {
          uid: data.uid,
          photoUrl: data.photoUrl,
        },
      },
    });

    await setDoc(userRef, { ...data, id });

    const idToken = await user.user.getIdToken();

    const response = await fetch("/api/auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idToken }),
    });

    const res = await response.json();

    if (response.ok && res.success) {
      return true;
    } else return false;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export async function createAccount(
  name: string,
  email: string,
  password: string
) {
  try {
    const user = await createUserWithEmailAndPassword(auth, email, password);
    let data = {
      email,
      name,
      photoUrl: null,
      uid: user.user.uid,
      isAdmin: false,
    };

    const userRef = doc(db, "users", user.user.uid);
    const id = await chi("/sub-account/create", {
      body: {
        name: data.name,
        email: data.email,
        firstName: data?.name?.split(" ")[0],
        lastName: data?.name?.split(" ")[1],
        meta: {
          uid: data.uid,
          photoUrl: data.photoUrl,
        },
      },
    });
    await setDoc(userRef, { ...data, id: id.data.id });

    const idToken = await user.user.getIdToken();

    const response = await fetch("/api/auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idToken }),
    });

    const res = await response.json();

    if (response.ok && res.success) {
      return true;
    } else return false;
  } catch (err) {
    console.log(err);
    return false;
  }
}

export async function signOut() {
  try {
    await auth.signOut();

    const response = await fetch("/api/auth/logout", {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await response.json();

    if (response.ok && res.success) {
      return true;
    } else return false;
  } catch (err) {
    console.log(err);
    return false;
  }
}
