import React from "react";
import { Calendar } from "lucide-react";


export default function InputMonth({ className = "", ...props }) {
    return (
        <div className="relative">
            <input
                type="month"
                {...props}
                className={`border p-2 pr-10 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-emerald-300 ${className}`}
            />
            <Calendar className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
        </div>
    );
}