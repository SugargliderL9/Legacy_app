"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";
import { animate } from "animejs";

type Props = {
  open: boolean;
  title: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function DeleteModal({ open, title, onCancel, onConfirm }: Props) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && modalRef.current) {
      animate(modalRef.current, {
        scale: [0.9, 1],
        opacity: [0, 1],
        duration: 260,
        easing: "easeOutQuad",
      });
    }
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            ref={modalRef}
            className="liminal-panel w-full max-w-sm rounded-2xl p-6 shadow-xl"
          >
            <h3 className="text-lg font-semibold text-white mb-2">
              Eliminar tarea
            </h3>
            <p className="text-sm text-white mb-6">
              ¿Seguro que deseas eliminar{" "}
              <span className="font-semibold text-liminal-shadow">
                {title}
              </span>
              ?
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={onCancel}
                className="px-4 py-2 rounded-lg bg-liminal-mist text-white hover:bg-liminal-stone transition"
              >
                Cancelar
              </button>

              <button
                onClick={onConfirm}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
              >
                Eliminar
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
