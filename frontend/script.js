
const API_BASE = "http://127.0.0.1:8000";

const authModal = document.getElementById("auth-modal");
const authForm = document.getElementById("auth-form");
const authTitle = document.getElementById("auth-title");
const authSubtitle = document.getElementById("auth-subtitle");
const authSubmit = document.getElementById("auth-submit");
const authMessage = document.getElementById("auth-message");
const usernameWrap = document.getElementById("username-wrap");
const usernameInput = document.getElementById("auth-username");
const emailInput = document.getElementById("auth-email");
const passwordInput = document.getElementById("auth-password");
const loginTab = document.getElementById("login-tab");
const registerTab = document.getElementById("register-tab");

let authMode = "login";

const questions = [
  "I felt overwhelmed by my everyday responsibilities.",
  "I found it difficult to relax.",
  "I felt worried about things outside my control.",
  "I felt mentally tired or drained.",
  "I found it hard to switch off from my worries."
];

const answerOptions = [
  { value: 0, label: "Not at all" },
  { value: 1, label: "Occasionally" },
  { value: 2, label: "Often" },
  { value: 3, label: "Almost always" }
];

// ------------------------------
// API helper
// ------------------------------

async function postToApi(endpoint, parameters) {
  const query = new URLSearchParams(parameters);

  const response = await fetch(`${API_BASE}/${endpoint}?${query}`, {
    method: "POST"
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || data.message || "Something went wrong.");
  }

  return data;
}

function showMessage(element, message, type = "") {
  element.textContent = message;
  element.classList.remove("status-success", "status-error");

  if (type === "success") element.classList.add("status-success");
  if (type === "error") element.classList.add("status-error");
}

// ------------------------------
// Login and registration dialog
// ------------------------------

function openAuth(mode = "login") {
  setAuthMode(mode);
  authModal.classList.remove("hidden");
  authModal.classList.add("flex");
  document.body.style.overflow = "hidden";

  setTimeout(() => {
    if (mode === "register") {
      usernameInput.focus();
    } else {
      emailInput.focus();
    }
  }, 50);
}

function closeAuth() {
  authModal.classList.add("hidden");
  authModal.classList.remove("flex");
  document.body.style.overflow = "";
}

function setAuthMode(mode) {
  authMode = mode;
  const isRegister = mode === "register";

  authTitle.textContent = isRegister
    ? "Create your little space."
    : "Welcome back.";

  authSubtitle.textContent = isRegister
    ? "Start with a few simple details."
    : "Sign in to continue your journey.";

  authSubmit.innerHTML = isRegister
    ? 'Create account <span aria-hidden="true">→</span>'
    : 'Log in <span aria-hidden="true">→</span>';

  usernameWrap.classList.toggle("hidden", !isRegister);
  usernameInput.required = isRegister;

  loginTab.classList.toggle("active", !isRegister);
  registerTab.classList.toggle("active", isRegister);

  passwordInput.autocomplete = isRegister
    ? "new-password"
    : "current-password";

  showMessage(authMessage, "");
}

document.getElementById("nav-login").addEventListener("click", () => {
  openAuth("login");
});

document.getElementById("nav-register").addEventListener("click", () => {
  openAuth("register");
});

document.getElementById("close-auth").addEventListener("click", closeAuth);
loginTab.addEventListener("click", () => setAuthMode("login"));
registerTab.addEventListener("click", () => setAuthMode("register"));

authModal.addEventListener("click", (event) => {
  if (event.target === authModal) closeAuth();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !authModal.classList.contains("hidden")) {
    closeAuth();
  }
});

// ------------------------------
// Submit login or registration
// ------------------------------

authForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = emailInput.value.trim().toLowerCase();
  const password = passwordInput.value;

  const parameters = {
    email,
    password
  };

  if (authMode === "register") {
    parameters.username = usernameInput.value.trim();

    if (!parameters.username) {
      showMessage(authMessage, "Please enter your name.", "error");
      return;
    }
  }

  authSubmit.disabled = true;
  authSubmit.textContent = "Please wait...";
  showMessage(authMessage, "");

  try {
    const endpoint = authMode === "register" ? "register" : "login";
    const data = await postToApi(endpoint, parameters);

    const message = data.message || "Request completed.";
    const lowerMessage = message.toLowerCase();

    const indicatesFailure =
      /error|invalid|incorrect|already exists|already registered|not found|failed|must be|please register/.test(lowerMessage);

    if (indicatesFailure) {
      showMessage(authMessage, message, "error");
      return;
    }

    if (authMode === "register") {
      showMessage(authMessage, message, "success");
      document.getElementById("assessment-email").value = email;
      setAuthMode("login");
      emailInput.value = email;
      passwordInput.value = "";
      showMessage(
        authMessage,
        `${message} You can now log in.`,
        "success"
      );
    } else if (/success|welcome|logged in/i.test(message)) {
      showMessage(authMessage, message, "success");
      document.getElementById("assessment-email").value = email;

      setTimeout(() => {
        closeAuth();
        document.getElementById("check-in").scrollIntoView({
          behavior: "smooth"
        });
      }, 900);
    } else {
      showMessage(authMessage, message, "success");
    }
  } catch (error) {
    showMessage(
      authMessage,
      `Could not connect to the server. ${error.message}`,
      "error"
    );
  } finally {
    authSubmit.disabled = false;
    authSubmit.innerHTML =
      authMode === "register"
        ? 'Create account <span aria-hidden="true">→</span>'
        : 'Log in <span aria-hidden="true">→</span>';
  }
});

// ------------------------------
// Build the assessment questions
// ------------------------------

const questionsContainer = document.getElementById("assessment-questions");

questions.forEach((question, index) => {
  const questionNumber = index + 1;

  const card = document.createElement("fieldset");
  card.className = "question-card";
  card.innerHTML = `
    <legend class="question-title">
      <span class="mr-2 text-sage">${String(questionNumber).padStart(2, "0")}</span>
      ${question}
    </legend>
    <div class="space-y-2">
      ${answerOptions.map((option) => `
        <label class="answer-option">
          <input
            type="radio"
            name="q${questionNumber}"
            value="${option.value}"
            required
          />
          <span>${option.label}</span>
        </label>
      `).join("")}
    </div>
  `;

  questionsContainer.appendChild(card);
});

// ------------------------------
// Start, cancel, and retake assessment
// ------------------------------

const assessmentStart = document.getElementById("assessment-start");
const assessmentForm = document.getElementById("assessment-form");
const assessmentResult = document.getElementById("assessment-result");
const assessmentMessage = document.getElementById("assessment-message");

document.getElementById("start-assessment").addEventListener("click", () => {
  assessmentStart.classList.add("hidden");
  assessmentResult.classList.add("hidden");
  assessmentForm.classList.remove("hidden");
});

function resetAssessment() {
  assessmentForm.reset();
  assessmentForm.classList.add("hidden");
  assessmentResult.classList.add("hidden");
  assessmentStart.classList.remove("hidden");
  showMessage(assessmentMessage, "");
}

document.getElementById("cancel-assessment").addEventListener("click", resetAssessment);
document.getElementById("retake-assessment").addEventListener("click", resetAssessment);

// ------------------------------
// Submit assessment to FastAPI
// ------------------------------

assessmentForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("assessment-email").value.trim().toLowerCase();
  const parameters = { email };

  for (let i = 1; i <= questions.length; i++) {
    const selected = assessmentForm.querySelector(
      `input[name="q${i}"]:checked`
    );

    if (!selected) {
      showMessage(
        assessmentMessage,
        `Please answer question ${i}.`,
        "error"
      );
      return;
    }

    parameters[`q${i}`] = selected.value;
  }

  const submitButton = assessmentForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  submitButton.textContent = "Submitting...";
  showMessage(assessmentMessage, "");

  try {
    const data = await postToApi("assessment", parameters);

    if (
      data.message &&
      /please register|not found|error|failed/i.test(data.message)
    ) {
      showMessage(assessmentMessage, data.message, "error");
      return;
    }

    document.getElementById("result-title").textContent =
      data.result || "Your check-in is complete.";

    document.getElementById("result-copy").textContent =
      getReflection(data.result);

    assessmentForm.classList.add("hidden");
    assessmentResult.classList.remove("hidden");

    assessmentResult.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  } catch (error) {
    showMessage(
      assessmentMessage,
      `We couldn't submit your check-in. ${error.message}`,
      "error"
    );
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML =
      'Submit my check-in <span aria-hidden="true">→</span>';
  }
});

function getReflection(result = "") {
  const normalized = result.toLowerCase();

  if (normalized.includes("high")) {
    return "It sounds like things may have felt heavy lately. If you can, give yourself a little breathing room and consider talking with someone you trust or a qualified mental health professional.";
  }

  if (normalized.includes("moderate")) {
    return "You may have been carrying a fair amount recently. Try making a little space for rest, a calming activity, or a conversation with someone you trust.";
  }

  if (normalized.includes("low")) {
    return "Take a moment to acknowledge how you're feeling. Keep making room for rest, connection, and the little things that help you feel grounded.";
  }

  return "Thank you for taking a moment to check in with yourself. Be gentle with yourself, whatever your responses may be.";
}
