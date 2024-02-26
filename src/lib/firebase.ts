import "server-only";

import { cookies } from "next/headers";
import {
  initializeApp,
  getApps,
  cert,
  ServiceAccount,
} from "firebase-admin/app";
import { SessionCookieOptions, getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const ss = JSON.parse(process.env.SS as string);

export const firebaseApp =
  getApps().find((it) => it.name === "chimoney-1418a") ||
  initializeApp(
    {
      credential: cert(ss as ServiceAccount),
    },
    "chimoney-1418a"
  );
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);

export async function isUserAuthenticated(
  session: string | undefined = undefined
) {
  const _session = session ?? (await getSession());
  if (!_session) return false;

  try {
    const isRevoked = !(await auth.verifySessionCookie(_session, true));
    return !isRevoked;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function getCurrentUser() {
  const session = await getSession();

  if (!(await isUserAuthenticated(session))) {
    return null;
  }

  const decodedIdToken = await auth.verifySessionCookie(session!);
  const currentUser = await auth.getUser(decodedIdToken.uid);

  if (currentUser) {
    const userRef = db.collection("users").doc(currentUser.uid);
    const user = await userRef.get();
    if (user.exists) {
      return user.data();
    } else
      return {
        uid: currentUser.uid,
        email: currentUser.email,
        isAdmin: false,
      };
  }
}

async function getSession() {
  try {
    return cookies().get("__chiSession")?.value;
  } catch (error) {
    return undefined;
  }
}

export async function createSessionCookie(
  idToken: string,
  sessionCookieOptions: SessionCookieOptions
) {
  return auth.createSessionCookie(idToken, sessionCookieOptions);
}

export async function revokeAllSessions(session: string) {
  const decodedIdToken = await auth.verifySessionCookie(session);

  return await auth.revokeRefreshTokens(decodedIdToken.sub);
}
