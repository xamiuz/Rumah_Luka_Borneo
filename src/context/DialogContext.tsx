'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AlertCircle, CheckCircle2, HelpCircle, Info, X } from 'lucide-react';

export type DialogType = 'confirm' | 'alert' | 'success' | 'warning' | 'danger';

interface DialogOptions {
  title?: string;
  message: string;
  type?: DialogType;
  confirmLabel?: string;
  cancelLabel?: string;
}

interface DialogContextType {
  showAlert: (message: string, title?: string, type?: DialogType) => Promise<void>;
  showConfirm: (message: string, title?: string, options?: Partial<DialogOptions>) => Promise<boolean>;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export function DialogProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [dialogState, setDialogState] = useState<{
    title: string;
    message: string;
    type: DialogType;
    confirmLabel: string;
    cancelLabel?: string;
    isConfirm: boolean;
    resolve: (value: any) => void;
  } | null>(null);

  const showAlert = (message: string, title: string = 'Pemberitahuan', type: DialogType = 'alert'): Promise<void> => {
    return new Promise((resolve) => {
      setDialogState({
        title,
        message,
        type,
        confirmLabel: 'OK',
        isConfirm: false,
        resolve: () => {
          setIsOpen(false);
          resolve();
        },
      });
      setIsOpen(true);
    });
  };

  const showConfirm = (
    message: string,
    title: string = 'Konfirmasi Tindakan',
    options?: Partial<DialogOptions>
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      setDialogState({
        title,
        message,
        type: options?.type || 'confirm',
        confirmLabel: options?.confirmLabel || 'Ya, Lanjutkan',
        cancelLabel: options?.cancelLabel || 'Batal',
        isConfirm: true,
        resolve: (confirmed: boolean) => {
          setIsOpen(false);
          resolve(confirmed);
        },
      });
      setIsOpen(true);
    });
  };

  const handleConfirm = () => {
    if (dialogState) {
      dialogState.resolve(true);
    }
  };

  const handleCancel = () => {
    if (dialogState) {
      dialogState.resolve(false);
    }
  };

  // Icon mapping
  const getIcon = () => {
    if (!dialogState) return null;
    switch (dialogState.type) {
      case 'danger':
        return <AlertCircle className="w-5 h-5 text-rose-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-amber-600" />;
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case 'confirm':
        return <HelpCircle className="w-5 h-5 text-blue-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getIconBg = () => {
    if (!dialogState) return 'bg-blue-50';
    switch (dialogState.type) {
      case 'danger':
        return 'bg-rose-50 border-rose-100';
      case 'warning':
        return 'bg-amber-50 border-amber-100';
      case 'success':
        return 'bg-emerald-50 border-emerald-100';
      default:
        return 'bg-blue-50 border-blue-100';
    }
  };

  return (
    <DialogContext.Provider value={{ showAlert, showConfirm }}>
      {children}

      {/* Popout Modal Dialog Container */}
      {isOpen && dialogState && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="p-5 pb-4 flex items-start gap-3.5">
              <div className={`p-2.5 rounded-xl border shrink-0 ${getIconBg()}`}>
                {getIcon()}
              </div>
              <div className="flex-1 min-w-0 pr-4">
                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                  {dialogState.title}
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed whitespace-pre-line">
                  {dialogState.message}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 flex items-center justify-end gap-2">
              {dialogState.isConfirm && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition cursor-pointer"
                >
                  {dialogState.cancelLabel}
                </button>
              )}
              <button
                type="button"
                onClick={handleConfirm}
                className={`px-4 py-2 text-xs font-bold text-white rounded-xl shadow-xs transition cursor-pointer ${
                  dialogState.type === 'danger'
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : dialogState.type === 'warning'
                    ? 'bg-amber-600 hover:bg-amber-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {dialogState.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </DialogContext.Provider>
  );
}

export function useDialog() {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return context;
}

