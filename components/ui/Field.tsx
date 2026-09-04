"use client";

type BaseProps = {
  id: string;
  name: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  autoComplete?: string;
  inputMode?: "text" | "email" | "tel";
  placeholder?: string;
};

const control =
  "min-h-12 w-full rounded-[2px] border border-rule bg-surface px-3.5 py-3 text-body text-ink transition-colors placeholder:text-faint focus:border-accent aria-[invalid=true]:border-flag";

/**
 * Labels are always above and always visible — never a placeholder standing
 * in for a label. Errors are associated by aria-describedby and state the
 * fix, not the fact of failure.
 */
export function Field({
  id,
  name,
  label,
  required,
  error,
  hint,
  autoComplete,
  inputMode,
  placeholder,
  type = "text",
}: BaseProps & { type?: string }) {
  const describedBy = [error && `${id}-error`, hint && `${id}-hint`]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-mono text-caption text-muted">
        {label}
        {required && (
          <span className="text-flag" aria-hidden="true">
            {" "}
            *
          </span>
        )}
        {required && <span className="sr-only"> (required)</span>}
      </label>

      <input
        id={id}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        inputMode={inputMode}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy || undefined}
        className={control}
      />

      {hint && (
        <p id={`${id}-hint`} className="text-caption text-faint">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-caption text-flag">
          {error}
        </p>
      )}
    </div>
  );
}

export function TextArea({
  id,
  name,
  label,
  required,
  error,
  hint,
  rows = 4,
}: BaseProps & { rows?: number }) {
  const describedBy = [error && `${id}-error`, hint && `${id}-hint`]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-mono text-caption text-muted">
        {label}
        {required && (
          <span className="text-flag" aria-hidden="true">
            {" "}
            *
          </span>
        )}
        {required && <span className="sr-only"> (required)</span>}
      </label>

      <textarea
        id={id}
        name={name}
        rows={rows}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy || undefined}
        className={`${control} resize-y`}
      />

      {hint && (
        <p id={`${id}-hint`} className="text-caption text-faint">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-caption text-flag">
          {error}
        </p>
      )}
    </div>
  );
}

export function Select({
  id,
  name,
  label,
  options,
  required,
}: {
  id: string;
  name: string;
  label: string;
  options: readonly string[];
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-mono text-caption text-muted">
        {label}
      </label>
      {/* Native select: correct behaviour on mobile, accessible for free. */}
      <select id={id} name={name} required={required} className={control}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
