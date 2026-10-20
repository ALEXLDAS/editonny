'use client';
import { useEffect, useId, useRef, useState, type ChangeEventHandler, type CSSProperties } from 'react';
import { cx, flag, type BaseProps } from '../lib';

/** Labeled input or textarea: a dark well that lifts and glows on focus. `counter` adds n/max and a filling underline. */
export type TextFieldProps = BaseProps & {
  label?: string;
  help?: string;
  error?: string;
  multiline?: boolean;
  rows?: number;
  counter?: number;
  inputStyle?: CSSProperties;
  id?: string;
  name?: string;
  type?: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  autoFocus?: boolean;
  autoComplete?: string;
  spellCheck?: boolean;
  ariaLabel?: string;
  onChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
};

export function TextField({ label, help, error, multiline, rows = 3, counter, inputStyle, id, name, type = 'text', value, defaultValue, placeholder, disabled, readOnly, required, autoFocus, autoComplete, spellCheck, ariaLabel, onChange, className, style }: TextFieldProps) {
  const generated = useId();
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue ?? '');
  const field = useRef<HTMLInputElement & HTMLTextAreaElement>(null);
  useEffect(() => {
    const form = field.current?.form;
    if (!form || value !== undefined) return;
    // A form reset restores defaultValue without a change event; read the field once the reset has run.
    const sync = () => { setTimeout(() => { if (field.current) setUncontrolledValue(field.current.value); }); };
    form.addEventListener('reset', sync);
    return () => form.removeEventListener('reset', sync);
  }, [value]);
  const fieldId = id ?? generated;
  const message = error || help;
  const length = (value ?? uncontrolledValue).length;
  const handleChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = event => {
    if (value === undefined) setUncontrolledValue(event.target.value);
    onChange?.(event);
  };
  const shared = {
    ref: field, id: fieldId, name, className: 'ds-field__input', value, defaultValue, placeholder, disabled, readOnly, required, autoFocus, autoComplete, spellCheck,
    maxLength: counter, 'aria-label': label ? undefined : ariaLabel, 'aria-invalid': error ? true : undefined,
    'aria-describedby': message ? `${fieldId}-message` : undefined, style: inputStyle, onChange: handleChange,
  };
  return (
    <div className={cx('ds-field', className)} style={style} data-invalid={flag(error)} data-multiline={flag(multiline)}>
      {(label || counter) && (
        <div className="ds-field__head">
          {label && <label className="ds-field__label" htmlFor={fieldId}>{label}</label>}
          {counter && <span className="ds-field__count" aria-live="polite" data-near={String(length / counter > 0.9)}>{`${length}/${counter}`}</span>}
        </div>
      )}
      <span className="ds-field__control">
        {multiline ? <textarea {...shared} rows={rows} /> : <input {...shared} type={type} />}
        {counter && <span className="ds-field__meter" aria-hidden="true" style={{ '--progress': String(Math.min(1, length / counter)) }} />}
      </span>
      {message && <span className="ds-field__message" id={`${fieldId}-message`}>{message}</span>}
    </div>
  );
}
