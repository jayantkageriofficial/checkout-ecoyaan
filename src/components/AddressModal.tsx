"use client";

import { useState } from "react";
import { useKey } from "react-use";
import { ShippingAddress } from "@/types";

type FieldKey = Exclude<keyof ShippingAddress, "id">;
type FormErrors = Partial<Record<FieldKey, string>>;

const empty: ShippingAddress = {
  fullName: "",
  email: "",
  phone: "",
  pinCode: "",
  city: "",
  state: "",
};

function validate(f: ShippingAddress): FormErrors {
  const e: FormErrors = {};
  if (!f.fullName.trim()) e.fullName = "Required";
  if (!f.phone.trim()) {
    e.phone = "Required";
  } else if (!/^[6-9]\d{9}$/.test(f.phone)) {
    e.phone = "Enter a valid 10-digit mobile number";
  }
  if (!f.email.trim()) {
    e.email = "Required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) {
    e.email = "Enter a valid email";
  }
  if (!f.pinCode.trim()) {
    e.pinCode = "Required";
  } else if (!/^\d{6}$/.test(f.pinCode)) {
    e.pinCode = "6-digit PIN required";
  }
  if (!f.city.trim()) e.city = "Required";
  if (!f.state.trim()) e.state = "Required";
  return e;
}

// Defined OUTSIDE the modal so React never remounts it on re-render
interface FieldInputProps {
  name: FieldKey;
  label: string;
  placeholder: string;
  type?: string;
  value: string;
  maxLength?: number | undefined;
  error?: string;
  touched?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
}

function FieldInput({
  name,
  label,
  placeholder,
  maxLength,
  type = "text",
  value,
  error,
  touched,
  onChange,
  onBlur,
}: FieldInputProps) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">
        {label} <span className="text-red-400">*</span>
      </label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`w-full px-3 py-2 text-sm border rounded-lg outline-none transition-colors ${
          error && touched
            ? "border-red-300 bg-red-50 focus:ring-1 focus:ring-red-200"
            : "border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-100"
        }`}
      />
      {error && touched && (
        <p className="text-[11px] text-red-500 mt-0.5">{error}</p>
      )}
    </div>
  );
}

interface Props {
  initial?: ShippingAddress | null;
  onSave: (address: ShippingAddress) => void;
  onClose: () => void;
}

export default function AddressModal({ initial, onSave, onClose }: Props) {
  const [form, setForm] = useState<ShippingAddress>(initial ?? empty);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<FieldKey, boolean>>>(
    {},
  );

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target as { name: FieldKey; value: string };
    const updated = { ...form, [name]: value };
    setForm(updated);
    if (touched[name]) setErrors(validate(updated));
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    const name = e.target.name as FieldKey;
    setTouched((p) => ({ ...p, [name]: true }));
    setErrors(validate(form));
  }

  function submitForm() {
    const allTouched = Object.fromEntries(
      Object.keys(empty).map((k) => [k, true]),
    ) as Record<FieldKey, boolean>;
    setTouched(allTouched);
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length === 0) onSave(form);
  }

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    submitForm();
  }

  useKey("Escape", onClose);
  useKey("Enter", submitForm);

  const fieldProps = (name: FieldKey) => ({
    name,
    value: form[name] ?? "",
    error: errors[name],
    touched: touched[name],
    onChange: handleChange,
    onBlur: handleBlur,
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-800">
            {initial ? "Edit Address" : "Add Delivery Address"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-3">
          <FieldInput
            {...fieldProps("fullName")}
            label="Full Name"
            placeholder="Rahul Sharma"
          />
          <FieldInput
            {...fieldProps("phone")}
            label="Mobile Number"
            placeholder="9876543210"
            type="tel"
            maxLength={10}
          />
          <FieldInput
            {...fieldProps("email")}
            label="Email"
            placeholder="rahul@example.com"
            type="email"
          />
          <div className="flex gap-3">
            <div className="flex-1">
              <FieldInput
                {...fieldProps("pinCode")}
                label="PIN Code"
                placeholder="560001"
                maxLength={6}
              />
            </div>
            <div className="flex-1">
              <FieldInput
                {...fieldProps("city")}
                label="City"
                placeholder="Bengaluru"
              />
            </div>
          </div>
          <FieldInput
            {...fieldProps("state")}
            label="State"
            placeholder="Karnataka"
          />

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 text-sm bg-green-700 hover:bg-green-800 text-white font-semibold rounded-lg transition-colors"
            >
              Save Address
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
