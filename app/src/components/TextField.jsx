'use client';
import { useId, useLayoutEffect, useRef, useState } from 'react';
import c from '@/tokens/components.json';
import Button from './Button';
import Lucide, { lucide } from '@/lib/Lucide';
import { rec } from '@/lib/rec';
import '@/styles/components.css';
import './textfield.css';

// Text field, built from its spec: components/textfield.json → (npm run tokens) → components.json + components.css (--tf-*).
// Change the spec, not this file. Docs: /components/text-field.
//
//   <TextField label="Name" hint="As on your ID" />                     one line
//   <TextArea label="Prompt" rows={3} maxRows={8} maxLength={400} showCount />   several lines, grows with the text
//   <Field label="…" hint="…" error="…">…your own control…</Field>       the frame alone: label, hint, error, count
//
// Shared props (TextField and TextArea; everything else goes to the native input / textarea):
//   label            string · always give one; the visible label is the field's name
//   optional         marks the label "optional" (required fields get no marker)
//   hint             string · helper text under the control
//   error            string · shows the error in the hint's place and marks the field invalid; '' = none yet.
//                    Pass error={''} (not undefined) when it may appear later: that keeps the live region mounted
//   invalid          red border without a message
//   size             'xs' (32, default) | 'sm' (40) | 'md' (48)
//   icon             Lucide name · leading icon, decoration
//   trailingIcon     Lucide name · trailing icon, decoration
//   prefix / suffix  text inside the frame (https://, $, .com)
//   clearable        a ghost icon button that clears the value (shown only when there is a value; Esc does the same)
//   showCount        'n / maxLength' on the right of the message row; needs maxLength
//   disabled, readOnly, placeholder, value, defaultValue, onChange, maxLength, id: native
//   state            'hover' | 'focus' forces a look, for the docs
// TextField only: type="password" adds a show / hide button.
// TextArea only: rows (min, default 3), maxRows (default 8), autoGrow (default true).
const spec = c.textfield;
export const TEXTFIELD = spec;
export const SIZE_NAMES = ['xs', 'sm', 'md'];
const V = Object.fromEntries(spec.vars.map((v) => [v.key, v]));
const TY = spec.types;
// The Button that sits inside the frame: one step smaller than the field, from the spec (xs 2xs, sm 2xs, md xs).
const ACTION = Object.fromEntries(SIZE_NAMES.map((s) => [s, V[`${s}-action`].ref.split('/').pop()]));
// A part's token for the inspector: the token name, or the set value.
const tok = (key) => V[key].ref || `layout · ${V[key].px}px (set)`;

export function Field({ id, label, optional, hint, error, count, size = 'xs', disabled, invalid, children, className = '', ...rest }) {
  const hintId = `${id}-hint`, countId = `${id}-count`;
  const hasMsg = hint !== undefined || error !== undefined || count;
  const showError = !!error;
  return (
    <div className={`tf ${className}`.trim()} data-size={size} data-disabled={disabled || undefined} data-invalid={invalid || showError || undefined} {...rest}>
      {label && (
        <label className={`tf-label ${TY.label}`} htmlFor={id}
          {...rec('text field · label', [['type', 'type/label/md/medium'], ['text colour', tok('label-color')], ['gap to control', tok('label-gap')]])}>
          {label}{optional && <span className={`tf-optional ${TY['label-optional']}`}>optional</span>}
        </label>
      )}
      {children}
      {hasMsg && (
        <div className="tf-msg">
          {/* The live region stays mounted, so an error that arrives later is read out. */}
          {(hint !== undefined || error !== undefined) && <div className={`tf-note ${TY.message}`} aria-live="polite" id={hintId} data-error={showError || undefined}
            {...rec(showError ? 'text field · error' : 'text field · hint', [['type', 'type/body/sm/regular'], ['text colour', tok(showError ? 'message-error' : 'message-color')], ['gap to control', tok('message-gap')]])}>
            {showError ? <><Lucide name="circle-alert" size="xs" />{error}</> : hint}
          </div>}
          {count && <span className={`tf-count ${TY.count}`} id={countId} data-limit={count.n >= count.max || undefined}>{count.n} / {count.max}</span>}
        </div>
      )}
    </div>
  );
}

function Control({ multiline, label, optional, hint, error, invalid, size = 'xs', icon, trailingIcon, prefix, suffix, clearable, showCount, state,
  disabled, readOnly, type = 'text', value, defaultValue, onChange, maxLength, id, rows = 3, maxRows = 8, autoGrow = true, ref, className, onKeyDown, 'aria-label': ariaLabel, ...props }) {
  const uid = useId(), fid = id || `tf-${uid}`;
  const inputRef = useRef(null);
  const [inner, setInner] = useState(String(defaultValue ?? ''));
  const [shown, setShown] = useState(false);
  const cur = value !== undefined ? String(value) : inner;
  const isPassword = !multiline && type === 'password';
  const canClear = clearable && !disabled && !readOnly;
  const setRef = (el) => { inputRef.current = el; if (typeof ref === 'function') ref(el); else if (ref) ref.current = el; };

  // Textarea: the height follows the text, between min rows and max rows (no animation: it tracks the caret).
  useLayoutEffect(() => {
    const el = inputRef.current;
    if (!multiline || !autoGrow || !el) return;
    const cs = getComputedStyle(el), lh = parseFloat(cs.lineHeight), pad = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
    el.style.height = 'auto';
    const max = maxRows * lh + pad, h = Math.min(el.scrollHeight, max);
    el.style.height = `${Math.max(h, rows * lh + pad)}px`;
    el.style.overflowY = el.scrollHeight > max + 1 ? 'auto' : 'hidden';
  }, [multiline, autoGrow, cur, size, rows, maxRows]);

  const clear = () => {
    const el = inputRef.current;
    // Set the value the way the browser does, so controlled and uncontrolled fields both see a normal input event.
    const proto = multiline ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, '');
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.focus();
  };
  const keyDown = (e) => {
    onKeyDown?.(e);
    if (e.key === 'Escape' && canClear && cur && !e.defaultPrevented) { e.preventDefault(); e.stopPropagation(); clear(); }
  };
  // Clicking the frame (not a button) puts the caret in the field.
  const frameDown = (e) => {
    if (disabled || e.target.closest('button, input, textarea')) return;
    e.preventDefault(); inputRef.current?.focus();
  };

  const hintId = `${fid}-hint`, countId = `${fid}-count`, preId = `${fid}-pre`, sufId = `${fid}-suf`;
  const hasCount = !!(showCount && maxLength);
  const describedBy = [(hint !== undefined || error !== undefined) && hintId, hasCount && countId, prefix && preId, suffix && sufId].filter(Boolean).join(' ') || undefined;
  const showError = !!error, isInvalid = invalid || showError;
  const Tag = multiline ? 'textarea' : 'input';
  const hasAction = canClear || isPassword;
  const inputProps = {
    id: fid, ref: setRef, className: `tf-input ${TY[size]}`, disabled, readOnly, maxLength, value, defaultValue,
    'aria-invalid': isInvalid || undefined, 'aria-describedby': describedBy, 'aria-label': label ? undefined : ariaLabel,
    onChange: (e) => { setInner(e.target.value); onChange?.(e); }, onKeyDown: keyDown, ...props,
    ...(multiline ? { rows } : { type: isPassword && shown ? 'text' : type }),
  };
  const rows_ = [['height', tok(`${size}-height`)], ['radius', tok(`${size}-radius`)], ['padding x', tok(`${size}-padding-x`)], ['gap', tok(`${size}-gap`)], ['type', `type/${TY[size].slice(5).replaceAll('-', '/')}`],
    ['background', 'fill/primary'], ['border', 'border/primary'], ['background · hover', 'fill/primary-hover'], ['border · hover', 'border/primary-hover'], ['border · focus', 'border/primary-active'], ['focus ring', 'border/focus · stroke/2'],
    ['border · invalid', 'border/critical'], ['effect', 'effect · inner-shade'], ['light', 'light/cursor']];

  return (
    <Field id={fid} label={label} optional={optional} hint={hint} error={error} size={size} disabled={disabled} invalid={invalid} className={className}
      count={hasCount ? { n: cur.length, max: maxLength } : undefined}>
      <div className="tf-frame lit" data-multiline={multiline || undefined} data-action={hasAction || undefined} data-readonly={readOnly || undefined} data-disabled={disabled || undefined}
        data-invalid={isInvalid || undefined} data-state={state} onMouseDown={frameDown}
        data-component="text field" {...rec(`text field · ${multiline ? 'textarea' : 'single line'} · ${size}`, rows_)}>
        {icon && <span className="tf-slot tf-lead"><Lucide name={icon} size={size === 'md' ? 'md' : 'sm'} /></span>}
        {prefix && <span className={`tf-affix ${TY[size]}`} id={preId}>{prefix}</span>}
        <Tag {...inputProps} />
        {suffix && <span className={`tf-affix ${TY[size]}`} id={sufId}>{suffix}</span>}
        {trailingIcon && <span className="tf-slot tf-trail"><Lucide name={trailingIcon} size={size === 'md' ? 'md' : 'sm'} /></span>}
        {canClear && (
          <span className="tf-slot tf-act" data-hidden={cur ? undefined : ''}>
            <Button type="ghost" size={ACTION[size]} icon={lucide('x')} label="Clear" onClick={clear} />
          </span>
        )}
        {isPassword && (
          <span className="tf-slot tf-act">
            <Button type="ghost" size={ACTION[size]} icon={lucide(shown ? 'eye-off' : 'eye')} label={shown ? 'Hide password' : 'Show password'} aria-pressed={shown} disabled={disabled} onClick={() => setShown((s) => !s)} />
          </span>
        )}
      </div>
    </Field>
  );
}

export function TextField(props) { return <Control {...props} />; }
export function TextArea(props) { return <Control multiline {...props} />; }
export default TextField;
