import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";
import {
  initializeAppCheck,
  ReCaptchaV3Provider
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app-check.js";

import { firebaseConfig, recaptchaV3SiteKey } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Monitor-mode App Check: collects data but does not block requests yet.
// Requires a real reCAPTCHA v3 site key (see firebase-config.js) — skipped until configured.
if (recaptchaV3SiteKey && !recaptchaV3SiteKey.startsWith("REPLACE_WITH_")) {
  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(recaptchaV3SiteKey),
    isTokenAutoRefreshEnabled: true
  });
}

const ERROR_KEY_BY_CODE = {
  "auth/email-already-in-use": "signup.error.emailInUse",
  "auth/invalid-email": "signup.error.invalidEmail",
  "auth/weak-password": "signup.error.weakPassword",
  "auth/network-request-failed": "signup.error.network",
  "auth/too-many-requests": "signup.error.tooManyRequests"
};

function showMessage(el, key, isError) {
  el.textContent = window.t(key);
  el.classList.toggle("form-message-error", isError);
  el.classList.toggle("form-message-success", !isError);
  el.hidden = false;
}

function setSubmitting(button, submitting) {
  button.disabled = submitting;
  button.textContent = window.t(submitting ? "signup.form.submitting" : "signup.form.submit");
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signup-form");
  if (!form) return;

  const nameInput = document.getElementById("signup-name");
  const emailInput = document.getElementById("signup-email");
  const passwordInput = document.getElementById("signup-password");
  const confirmInput = document.getElementById("signup-confirm-password");
  const submitButton = document.getElementById("signup-submit");
  const messageEl = document.getElementById("signup-message");
  const successEl = document.getElementById("signup-success");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    messageEl.hidden = true;

    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmInput.value;
    const name = nameInput.value.trim();

    if (password.length < 8) {
      showMessage(messageEl, "signup.error.passwordTooShort", true);
      return;
    }
    if (password !== confirmPassword) {
      showMessage(messageEl, "signup.error.passwordMismatch", true);
      return;
    }

    setSubmitting(submitButton, true);
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      if (name) {
        await updateProfile(credential.user, { displayName: name });
      }
      await sendEmailVerification(credential.user);

      form.hidden = true;
      successEl.hidden = false;
    } catch (error) {
      const key = ERROR_KEY_BY_CODE[error.code] || "signup.error.generic";
      showMessage(messageEl, key, true);
    } finally {
      setSubmitting(submitButton, false);
    }
  });
});
