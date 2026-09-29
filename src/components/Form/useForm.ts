/**
 * Controlled form instance (`useForm`).
 *
 * `useForm()` returns a stable handle that `MForm` binds to on mount, giving
 * imperative access to the form model and validation — the equivalent of
 * Ant Design's `Form.useForm()`.
 *
 * ```ts
 * const form = useForm()
 * form.setFieldsValue({ 'user.name': 'Ada' })
 * await form.validate()
 * ```
 */

import type { NamePath } from './paths'
import type { FormScrollToFieldOptions, FormValidateResult } from './types'

/** Imperative surface exposed by a bound form. */
export interface FormInstance {
  /** Read a single field value by name path. */
  getFieldValue: (name: NamePath) => unknown
  /** Snapshot of all field values. */
  getFieldsValue: () => Record<string, unknown>
  /** Write a single field value by name path. */
  setFieldValue: (name: NamePath, value: unknown) => void
  /**
   * Write several values at once. Keys are name paths, so nested writes work:
   * `setFieldsValue({ 'user.name': 'Ada', 'items[0].done': true })`.
   */
  setFieldsValue: (values: Record<string, unknown>) => void
  /** Validate every field, or only the given name paths. */
  validate: (nameList?: NamePath | NamePath[]) => Promise<FormValidateResult>
  /** Alias of `validate`, matching Ant Design naming. */
  validateFields: (nameList?: NamePath | NamePath[]) => Promise<FormValidateResult>
  /** Clear validation state (all fields, or the given name paths). */
  clearValidate: (nameList?: NamePath | NamePath[]) => void
  /** Restore the initial snapshot (all fields, or the given name paths). */
  resetFields: (nameList?: NamePath | NamePath[]) => void
  /** Reset every field and clear validation state. */
  reset: () => void
  /** Scroll a field into view (requires the item to have a `name`). */
  scrollToField: (name: NamePath, options?: FormScrollToFieldOptions) => void
  /** Scroll to the first field that currently has an error. */
  scrollToFirstError: (options?: FormScrollToFieldOptions) => void
  /** Current errors, keyed by name path. */
  readonly errors: Record<string, string>
  /** Current warning-only messages, keyed by name path. */
  readonly warnings: Record<string, string>
}

/**
 * The form-side implementation. `MForm` builds this and hands it to the
 * instance created by `useForm`.
 */
export interface FormInstanceApi {
  getFieldValue: (name: NamePath) => unknown
  getFieldsValue: () => Record<string, unknown>
  setFieldValue: (name: NamePath, value: unknown) => void
  validate: (nameList?: NamePath | NamePath[]) => Promise<FormValidateResult>
  clearValidate: (nameList?: NamePath | NamePath[]) => void
  resetFields: (nameList?: NamePath | NamePath[]) => void
  reset: () => void
  scrollToField: (name: NamePath, options?: FormScrollToFieldOptions) => void
  scrollToFirstError: (options?: FormScrollToFieldOptions) => void
  getErrors: () => Record<string, string>
  getWarnings: () => Record<string, string>
}

interface FormBinding {
  api: FormInstanceApi | null
}

/**
 * The binding lives on the instance itself (non-enumerable symbol key) rather
 * than in a `WeakMap`, so it survives a reactive proxy wrapper — props are
 * shallow-reactive, and identity lookups would otherwise miss.
 */
const FORM_BINDING = Symbol('morya-ui-form-binding')

function getBinding(instance: unknown): FormBinding | undefined {
  if (typeof instance !== 'object' || instance === null) return undefined
  return (instance as Record<PropertyKey, unknown>)[FORM_BINDING] as FormBinding | undefined
}

function requireApi(instance: FormInstance, method: string): FormInstanceApi {
  const binding = getBinding(instance)
  if (!binding?.api) {
    throw new Error(
      `[morya-ui] form.${method}() was called before the form was mounted. `
      + 'Pass the instance to `<MForm :form="form">` and call it after mount.',
    )
  }
  return binding.api
}

/** Connect a `useForm()` instance to a mounted form. Returns an unbind function. */
export function bindFormInstance(instance: FormInstance, api: FormInstanceApi): () => void {
  const binding = getBinding(instance)
  if (!binding) return () => {}

  binding.api = api
  return () => {
    if (binding.api === api) binding.api = null
  }
}

/** Create a controlled form instance. */
export function useForm(): FormInstance {
  const instance: FormInstance = {
    getFieldValue: name => requireApi(instance, 'getFieldValue').getFieldValue(name),
    getFieldsValue: () => requireApi(instance, 'getFieldsValue').getFieldsValue(),
    setFieldValue: (name, value) => requireApi(instance, 'setFieldValue').setFieldValue(name, value),
    setFieldsValue: (values) => {
      const api = requireApi(instance, 'setFieldsValue')
      for (const [name, value] of Object.entries(values)) api.setFieldValue(name, value)
    },
    validate: nameList => requireApi(instance, 'validate').validate(nameList),
    validateFields: nameList => requireApi(instance, 'validateFields').validate(nameList),
    clearValidate: nameList => requireApi(instance, 'clearValidate').clearValidate(nameList),
    resetFields: nameList => requireApi(instance, 'resetFields').resetFields(nameList),
    reset: () => requireApi(instance, 'reset').reset(),
    scrollToField: (name, options) => requireApi(instance, 'scrollToField').scrollToField(name, options),
    scrollToFirstError: options => requireApi(instance, 'scrollToFirstError').scrollToFirstError(options),
    get errors() {
      return getBinding(instance)?.api?.getErrors() ?? {}
    },
    get warnings() {
      return getBinding(instance)?.api?.getWarnings() ?? {}
    },
  }

  // Writable + configurable so the property stays valid through a reactive
  // proxy wrapper (Vue wraps the binding value on read).
  Object.defineProperty(instance, FORM_BINDING, {
    value: { api: null } satisfies FormBinding,
    enumerable: false,
    writable: true,
    configurable: true,
  })

  return instance
}

/** True when the value looks like a `useForm()` handle. */
export function isFormInstance(value: unknown): value is FormInstance {
  return getBinding(value) !== undefined
}
