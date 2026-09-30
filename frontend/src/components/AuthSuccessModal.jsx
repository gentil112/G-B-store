const AuthSuccessModal = ({ title, message }) => (
  <div
    className="auth-success-backdrop fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm"
    role="dialog"
    aria-modal="true"
    aria-labelledby="auth-success-title"
  >
    <div className="auth-success-card flex w-full max-w-sm flex-col items-center rounded-3xl bg-white px-7 py-10 text-center shadow-2xl dark:bg-gray-900 sm:px-10">
      <div className="auth-success-icon mb-6" aria-hidden="true">
        <svg viewBox="0 0 72 72" fill="none">
          <circle className="auth-success-circle" cx="36" cy="36" r="31" />
          <path className="auth-success-check" d="m21 37 10 10 21-22" />
        </svg>
      </div>
      <h2
        id="auth-success-title"
        className="text-3xl font-black text-gray-900 dark:text-white"
      >
        {title}
      </h2>
      <p className="mt-3 text-base text-gray-600 dark:text-gray-300">{message}</p>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Taking you to the home page…
      </p>
      <div className="mt-7 h-1.5 w-full overflow-hidden rounded-full bg-green-100 dark:bg-green-950/60">
        <div className="auth-success-progress h-full rounded-full bg-green-500" />
      </div>
    </div>
  </div>
);

export default AuthSuccessModal;
