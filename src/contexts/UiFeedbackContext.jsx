import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, CheckCircle2, Info, TriangleAlert, X } from 'lucide-react'

const UiFeedbackContext = createContext(null)

const toastToneMap = {
  success: {
    icon: CheckCircle2,
    className: 'bg-emerald-50/95 border-emerald-200 text-emerald-700',
    title: 'Succes',
  },
  error: {
    icon: AlertCircle,
    className: 'bg-red-50/95 border-red-200 text-red-700',
    title: 'Erreur',
  },
  info: {
    icon: Info,
    className: 'bg-slate-50/95 border-slate-200 text-slate-700',
    title: 'Information',
  },
}

const modalVariantMap = {
  default: {
    icon: Info,
    iconClass: 'text-brand-gold',
    confirmClass: 'bg-brand-ink text-white hover:bg-brand-ink/90',
  },
  danger: {
    icon: TriangleAlert,
    iconClass: 'text-red-600',
    confirmClass: 'bg-red-600 text-white hover:bg-red-700',
  },
}

const randomId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`

export const UiFeedbackProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])
  const [dialog, setDialog] = useState(null)
  const dialogResolverRef = useRef(null)

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const notify = useCallback((tone, message, options = {}) => {
    const safeTone = toastToneMap[tone] ? tone : 'info'
    const id = randomId()
    const toast = {
      id,
      tone: safeTone,
      title: options.title || toastToneMap[safeTone].title,
      message: String(message || '').trim(),
    }

    setToasts((prev) => [toast, ...prev].slice(0, 5))

    const duration = Number(options.duration)
    const ttl = Number.isFinite(duration) && duration > 0 ? duration : 4200
    window.setTimeout(() => dismissToast(id), ttl)

    return id
  }, [dismissToast])

  const notifySuccess = useCallback((message, options = {}) => notify('success', message, options), [notify])
  const notifyError = useCallback((message, options = {}) => notify('error', message, options), [notify])
  const notifyInfo = useCallback((message, options = {}) => notify('info', message, options), [notify])

  const closeDialog = useCallback((result) => {
    const resolver = dialogResolverRef.current
    dialogResolverRef.current = null
    setDialog(null)
    if (resolver) resolver(result)
  }, [])

  const openDialog = useCallback((nextDialog) => new Promise((resolve) => {
    if (dialogResolverRef.current) {
      dialogResolverRef.current(false)
    }
    dialogResolverRef.current = resolve
    setDialog(nextDialog)
  }), [])

  const confirmAction = useCallback((options = {}) => openDialog({
    mode: 'confirm',
    title: options.title || 'Confirmer cette action',
    message: options.message || 'Souhaitez-vous continuer ?',
    confirmLabel: options.confirmLabel || 'Confirmer',
    cancelLabel: options.cancelLabel || 'Annuler',
    variant: options.variant || 'default',
  }), [openDialog])

  const showInfo = useCallback((options = {}) => openDialog({
    mode: 'info',
    title: options.title || 'Information',
    message: options.message || '',
    confirmLabel: options.confirmLabel || 'Fermer',
    variant: options.variant || 'default',
  }), [openDialog])

  useEffect(() => () => {
    if (dialogResolverRef.current) {
      dialogResolverRef.current(false)
      dialogResolverRef.current = null
    }
  }, [])

  const contextValue = useMemo(() => ({
    notify,
    notifySuccess,
    notifyError,
    notifyInfo,
    confirmAction,
    showInfo,
  }), [notify, notifySuccess, notifyError, notifyInfo, confirmAction, showInfo])

  const modalVariant = modalVariantMap[dialog?.variant] || modalVariantMap.default
  const ModalIcon = modalVariant.icon

  return (
    <UiFeedbackContext.Provider value={contextValue}>
      {children}

      <div className="fixed bottom-5 right-5 z-[110] pointer-events-none w-[calc(100%-2.5rem)] sm:w-[390px] max-w-sm">
        <AnimatePresence>
          {toasts.map((toast) => {
            const tone = toastToneMap[toast.tone] || toastToneMap.info
            const ToastIcon = tone.icon
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className={`pointer-events-auto mb-2 rounded-2xl border shadow-xl p-4 backdrop-blur-sm ${tone.className}`}
              >
                <div className="flex items-start gap-3">
                  <ToastIcon size={18} className="mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{toast.title}</p>
                    <p className="text-xs mt-1 leading-relaxed break-words">{toast.message}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => dismissToast(toast.id)}
                    className="text-current/70 hover:text-current"
                    aria-label="Fermer la notification"
                  >
                    <X size={14} />
                  </button>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {dialog && (
          <motion.div
            className="fixed inset-0 z-[120] bg-black/45 backdrop-blur-[1px] flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => closeDialog(false)}
          >
            <motion.div
              className="w-full max-w-md rounded-2xl bg-white border border-brand-sand/70 shadow-2xl p-5"
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-start gap-3">
                <ModalIcon size={20} className={`mt-0.5 flex-shrink-0 ${modalVariant.iconClass}`} />
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-bold text-brand-ink font-serif">{dialog.title}</h3>
                  <p className="text-sm text-brand-ink/65 mt-2 leading-relaxed">{dialog.message}</p>
                </div>
              </div>
              <div className="mt-5 flex items-center justify-end gap-2">
                {dialog.mode === 'confirm' && (
                  <button
                    type="button"
                    onClick={() => closeDialog(false)}
                    className="inline-flex items-center gap-1 px-3.5 py-2 rounded-full border border-brand-sand/70 text-brand-ink/70 text-sm font-semibold"
                  >
                    {dialog.cancelLabel}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => closeDialog(true)}
                  className={`inline-flex items-center gap-1 px-3.5 py-2 rounded-full text-sm font-semibold ${modalVariant.confirmClass}`}
                >
                  {dialog.confirmLabel}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </UiFeedbackContext.Provider>
  )
}

export const useUiFeedback = () => {
  const context = useContext(UiFeedbackContext)
  if (!context) {
    throw new Error('useUiFeedback doit etre utilise avec UiFeedbackProvider.')
  }
  return context
}

