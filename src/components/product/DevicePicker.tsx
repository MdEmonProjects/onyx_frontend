"use client";

import { useEffect, useRef, useState } from "react";
import { brands } from "@/lib/catalog";
import { ChevronDownIcon } from "../Icons";
import styles from "./DevicePicker.module.css";

type Props = {
  brandId: string;
  deviceId: string;
  onChange: (brandId: string, deviceId: string) => void;
  invalid?: boolean;
  /** id for the trigger button, so other code can focus it. */
  id?: string;
  errorId?: string;
};

/**
 * Device chooser: a button that opens a panel with brand pills on top and
 * a scrolling list of that brand's models. Picking a model closes it.
 */
export function DevicePicker({ brandId, deviceId, onChange, invalid, id, errorId }: Props) {
  const [open, setOpen] = useState(false);
  const [viewBrandId, setViewBrandId] = useState(brandId);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const selectedBrand = brands.find((b) => b.id === brandId);
  const selected = selectedBrand?.devices.find((d) => d.id === deviceId);
  const viewBrand = brands.find((b) => b.id === viewBrandId) ?? brands[0];

  const openPanel = () => {
    setViewBrandId(brandId);
    setOpen(true);
  };

  const close = (refocus = false) => {
    setOpen(false);
    if (refocus) triggerRef.current?.focus();
  };

  // Close on outside click and Escape.
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close(true);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // On open, bring the chosen model into view and focus it.
  useEffect(() => {
    if (!open) return;
    const list = listRef.current;
    const current = list?.querySelector<HTMLButtonElement>('[aria-pressed="true"]');
    if (current) {
      current.scrollIntoView({ block: "nearest" });
      current.focus({ preventScroll: true });
    } else {
      list?.querySelector<HTMLButtonElement>("button")?.focus({ preventScroll: true });
    }
  }, [open, viewBrandId]);

  return (
    <div ref={rootRef} className={styles.root}>
      <button
        ref={triggerRef}
        id={id}
        type="button"
        className={styles.trigger}
        data-invalid={invalid}
        aria-expanded={open}
        aria-haspopup="true"
        aria-describedby={invalid ? errorId : undefined}
        onClick={() => (open ? close() : openPanel())}
      >
        <span className={styles.half}>{selectedBrand?.name ?? "Brand"}</span>
        <span className={styles.half} data-empty={!selected}>
          {selected?.name ?? "Choose your model"}
        </span>
        <ChevronDownIcon />
      </button>

      {open && (
        <div className={styles.panel} role="dialog" aria-label="Choose your device">
          <div className={styles.brands} role="group" aria-label="Brand">
            {brands.map((b) => (
              <button
                key={b.id}
                type="button"
                className={styles.pill}
                aria-pressed={b.id === viewBrandId}
                onClick={() => setViewBrandId(b.id)}
              >
                {b.name}
              </button>
            ))}
          </div>

          <ul ref={listRef} className={styles.list} aria-label={`${viewBrand.name} models`} data-lenis-prevent>
            {viewBrand.devices.map((d) => {
              const isSelected = viewBrand.id === brandId && d.id === deviceId;
              return (
                <li key={d.id}>
                  <button
                    type="button"
                    className={styles.model}
                    aria-pressed={isSelected}
                    onClick={() => {
                      onChange(viewBrand.id, d.id);
                      close(true);
                    }}
                  >
                    {d.name}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
