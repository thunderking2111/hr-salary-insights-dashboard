import type { CreateEmployeePayload } from "./types";

/** Matches backend `Employee.country` default (Indian org context). */
export const DEFAULT_EMPLOYEE_COUNTRY = "India";

/** Matches backend `Employee.currency` default. */
export const DEFAULT_EMPLOYEE_CURRENCY = "INR";

export const ADD_EMPLOYEE_FORM_DEFAULTS: Pick<CreateEmployeePayload, "country" | "currency"> = {
  country: DEFAULT_EMPLOYEE_COUNTRY,
  currency: DEFAULT_EMPLOYEE_CURRENCY,
};

export function applyEmployeePayloadDefaults(
  payload: CreateEmployeePayload,
): CreateEmployeePayload {
  return {
    ...payload,
    country: payload.country.trim() || DEFAULT_EMPLOYEE_COUNTRY,
    currency: payload.currency.trim() || DEFAULT_EMPLOYEE_CURRENCY,
  };
}
