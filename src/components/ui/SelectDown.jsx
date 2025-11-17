import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";

export default function SelectDown({ className = "", children, name, value, defaultValue, onChange, disabled }) {
    const containerRef = useRef(null);
    const optionNodes = React.Children.toArray(children).filter(Boolean);
    const options = optionNodes.map((child) => {
        const props = child.props || {};
        return {
            value: props.value ?? "",
            label: props.children,
            disabled: !!props.disabled,
            hidden: !!props.hidden,
        };
    });

    const placeholder = options.find((o) => o.value === "" && (o.disabled || o.hidden));
    const [open, setOpen] = useState(false);
    const [menuUp, setMenuUp] = useState(false);
    const [internalValue, setInternalValue] = useState(value ?? defaultValue ?? "");
    const selectedValue = value !== undefined ? value : internalValue;
    const selectedOption = options.find((o) => o.value === selectedValue);
    const displayLabel = selectedOption ? selectedOption.label : (placeholder ? placeholder.label : "");

    const changeValue = (v) => {
        if (value === undefined) setInternalValue(v);
        onChange && onChange({ target: { name, value: v } });
        setOpen(false);
    };
    useEffect(() => {
        const handler = (e) => {
            if (!containerRef.current || containerRef.current.contains(e.target)) return;
            setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div ref={containerRef} className={`relative ${disabled ? "opacity-60 pointer-events-none" : ""}`}>
            <button
                type="button"
                onClick={() => {
                    if (disabled) return;
                    // Deteksi ruang tersedia di viewport
                    if (!open) {
                        const rect = containerRef.current?.getBoundingClientRect();
                        const spaceBelow = window.innerHeight - rect.bottom;
                        const spaceAbove = rect.top;
                        // Jika ruang di bawah < 300px dan ruang di atas lebih besar, buka ke atas
                        setMenuUp(spaceBelow < 300 && spaceAbove > spaceBelow);
                        setOpen(true);
                    } else {
                        setOpen(false);
                    }
                }}
                className={`border rounded-lg w-full p-2 pr-10 text-left focus:outline-none focus:ring-2 focus:ring-emerald-300 transition-all duration-200 hover:border-emerald-300 ${selectedValue === "" ? "text-gray-400" : "text-gray-900"} ${className}`}
            >
                <span>{displayLabel || (placeholder ? placeholder.label : "")}</span>
                <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500 transition-transform ${open ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
                {open && (
                <motion.div
                key="menu"
                initial={{ opacity: 0, y: menuUp ? 6 : -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: menuUp ? 6 : -6, scale: 0.98 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute z-20 w-full rounded-xl border border-emerald-100 bg-white shadow-lg overflow-hidden"
                style={{ transformOrigin: menuUp ? "bottom" : "top", bottom: menuUp ? "calc(100% + 0.25rem)" : undefined, marginTop: menuUp ? undefined : '0.25rem' }}
                >
                    <ul className="max-h-64 overflow-auto py-1">
                        {options
                            .filter((o) => !o.hidden && !(o.value === "" && (o.disabled || o.hidden)))
                            .map((o) => {
                                const isSel = o.value === selectedValue;
                                return (
                                    <li key={`${o.value}-${o.label}`}>
                                        <button
                                            type="button"
                                            className={`w-full text-left px-4 py-2 flex items-center justify-between transition-colors duration-150 ${isSel ? "bg-emerald-50 text-emerald-700" : "hover:bg-emerald-50"}`}
                                            onClick={() => changeValue(o.value)}
                                        >
                                            <span>{o.label}</span>
                                            {isSel && <Check className="w-4 h-4 text-emerald-600" />}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
