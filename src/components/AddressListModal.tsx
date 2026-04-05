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
    shippingAddress?.id,
  );
  // undefined = list view, null = add new form, address object = edit form
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
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:rounded-2xl sm:max-w-md shadow-2xl max-h-[92vh] sm:max-h-[85vh] overflow-hidden flex flex-col rounded-t-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-base font-bold text-gray-800">Delivery Address</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {savedAddresses.length > 0
                ? `${savedAddresses.length} saved address${savedAddresses.length !== 1 ? "es" : ""}`
                : "Add your first address"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Address list — scrollable */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {savedAddresses.length === 0 && (
            <div className="flex flex-col items-center py-8 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-3">
                <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-600">No saved addresses</p>
              <p className="text-xs text-gray-400 mt-1">Add an address to get started</p>
            </div>
          )}

          {savedAddresses.map((addr) => (
            <div
              key={addr.id}
              onClick={() => setSelectedId(addr.id)}
              className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                selectedId === addr.id
                  ? "border-green-500 bg-green-50"
                  : "border-gray-100 hover:border-gray-200 bg-gray-50"
              }`}
            >
              <div className="mt-0.5 shrink-0">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    selectedId === addr.id
                      ? "border-green-500 bg-green-500"
                      : "border-gray-300"
                  }`}
                >
                  {selectedId === addr.id && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-semibold text-gray-800">{addr.fullName}</p>
                </div>
                <p className="text-xs text-gray-500">
                  {addr.city}, {addr.state} — {addr.pinCode}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{addr.phone}</p>
                <p className="text-xs text-gray-400 mt-0.5">{addr.email}</p>
              </div>

              <div className="flex flex-col gap-1.5 shrink-0 items-end">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingAddress(addr);
                  }}
                  className="text-xs text-green-700 hover:text-green-800 font-semibold border border-green-200 bg-white px-2.5 py-1 rounded-lg hover:bg-green-50 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(addr.id!);
                  }}
                  className="text-xs text-red-500 hover:text-red-600 font-semibold border border-red-100 bg-white px-2.5 py-1 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          {/* Add new address */}
          <button
            onClick={() => setEditingAddress(null)}
            className="flex items-center gap-3 text-sm text-green-700 hover:text-green-800 font-medium border-2 border-dashed border-green-300 rounded-xl px-4 py-3.5 w-full hover:bg-green-50 active:bg-green-100 transition-colors"
          >
            <div className="w-7 h-7 rounded-full border-2 border-dashed border-green-400 flex items-center justify-center shrink-0">
              <svg className="w-3.5 h-3.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="font-semibold">Add New Address</span>
          </button>
        </div>

        {/* Footer — fixed at bottom of modal */}
        <div className="px-5 pb-5 pt-3 border-t border-gray-100 shrink-0 flex gap-3">
          <button
            onClick={onClose}
            className="px-5 py-3 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 active:bg-gray-100 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedId}
            className="flex-1 py-3 text-sm bg-green-700 hover:bg-green-800 active:bg-green-900 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
          >
            {selectedId ? "Deliver Here" : "Select an Address"}
          </button>
        </div>
      </div>
    </div>
  );
}
