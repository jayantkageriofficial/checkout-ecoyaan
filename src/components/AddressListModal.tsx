"use client";

import { useState } from "react";
import { useKey } from "react-use";
import { ShippingAddress } from "@/types";
import { useCheckout } from "@/context/CheckoutContext";
import AddressModal from "./AddressModal";

interface Props {
  onClose: () => void;
  onSelect: (address: ShippingAddress) => void;
}

export default function AddressListModal({ onClose, onSelect }: Props) {
  const {
    savedAddresses,
    shippingAddress,
    addSavedAddress,
    updateSavedAddress,
    removeSavedAddress,
  } = useCheckout();

  const [selectedId, setSelectedId] = useState<string | undefined>(
    shippingAddress?.id
  );
  // undefined = list view, null = add new form, address = edit form
  const [editingAddress, setEditingAddress] = useState<
    ShippingAddress | null | undefined
  >(undefined);

  function handleSaveAddress(address: ShippingAddress) {
    if (editingAddress === null) {
      const newAddress = { ...address, id: crypto.randomUUID() };
      addSavedAddress(newAddress);
      setSelectedId(newAddress.id);
    } else {
      updateSavedAddress(address);
    }
    setEditingAddress(undefined);
  }

  function handleDelete(id: string) {
    removeSavedAddress(id);
    if (selectedId === id) setSelectedId(undefined);
  }

  function handleConfirm() {
    const addr = savedAddresses.find((a) => a.id === selectedId);
    if (addr) onSelect(addr);
  }

  useKey("Escape", onClose);
  useKey("Enter", () => {
    if (editingAddress === undefined) handleConfirm();
  });

  if (editingAddress !== undefined) {
    return (
      <AddressModal
        initial={editingAddress}
        onSave={handleSaveAddress}
        onClose={() => setEditingAddress(undefined)}
      />
    );
  }

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
            Select Delivery Address
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

        {/* Address list */}
        <div className="px-5 py-4 space-y-3">
          {savedAddresses.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-2">
              No saved addresses yet. Add one below.
            </p>
          )}

          {savedAddresses.map((addr) => (
            <div
              key={addr.id}
              onClick={() => setSelectedId(addr.id)}
              className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                selectedId === addr.id
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                checked={selectedId === addr.id}
                onChange={() => setSelectedId(addr.id)}
                className="accent-green-700 mt-0.5 shrink-0"
                onClick={(e) => e.stopPropagation()}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800">
                  {addr.fullName}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {addr.city}, {addr.state} — {addr.pinCode}
                </p>
                <p className="text-xs text-gray-500">{addr.phone}</p>
                <p className="text-xs text-gray-400">{addr.email}</p>
              </div>
              <div className="flex flex-col gap-1.5 shrink-0 items-end">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingAddress(addr);
                  }}
                  className="text-xs text-green-700 hover:text-green-800 font-medium border border-green-200 px-2 py-0.5 rounded-full hover:bg-green-50 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(addr.id!);
                  }}
                  className="text-xs text-red-500 hover:text-red-600 font-medium border border-red-100 px-2 py-0.5 rounded-full hover:bg-red-50 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          {/* Add new address */}
          <button
            onClick={() => setEditingAddress(null)}
            className="flex items-center gap-2 text-sm text-green-700 hover:text-green-800 font-medium border border-dashed border-green-300 rounded-lg px-4 py-3 w-full hover:bg-green-50 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add New Address
          </button>
        </div>

        {/* Footer */}
        {savedAddresses.length > 0 && (
          <div className="px-5 pb-5 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedId}
              className="flex-1 py-2.5 text-sm bg-green-700 hover:bg-green-800 disabled:bg-green-300 text-white font-semibold rounded-lg transition-colors"
            >
              Deliver Here
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
