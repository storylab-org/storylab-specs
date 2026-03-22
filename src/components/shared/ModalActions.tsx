import './ModalActions.css'

interface ModalAction {
  label: string
  onClick: () => void
  variant?: 'primary' | 'secondary'
}

interface ModalActionsProps {
  actions: ModalAction[]
}

/**
 * Reusable modal action buttons footer.
 * Provides consistent styling for modal buttons.
 *
 * Usage:
 * ```tsx
 * <ModalActions
 *   actions={[
 *     { label: 'Save', onClick: handleSave, variant: 'primary' },
 *     { label: 'Cancel', onClick: handleCancel }
 *   ]}
 * />
 * ```
 */
export default function ModalActions({ actions }: ModalActionsProps) {
  return (
    <div className="modal-actions">
      {actions.map((action, index) => (
        <button
          key={index}
          className={`modal-action-button modal-action-button-${action.variant || 'secondary'}`}
          onClick={action.onClick}
        >
          {action.label}
        </button>
      ))}
    </div>
  )
}
