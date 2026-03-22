import { ReactNode } from 'react'
import Modal from '@/components/editor/lexical/ui/Modal'

interface GenericModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  closeOnClickOutside?: boolean
}

/**
 * Generic, reusable modal wrapper component.
 * Unifies modal usage across the app with a simple interface.
 *
 * Usage:
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false)
 *
 * <GenericModal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="My Modal"
 *   closeOnClickOutside={true}
 * >
 *   <p>Modal content here</p>
 * </GenericModal>
 * ```
 */
export default function GenericModal({
  isOpen,
  onClose,
  title,
  children,
  closeOnClickOutside = true,
}: GenericModalProps) {
  if (!isOpen) return null

  return (
    <Modal
      title={title}
      onClose={onClose}
      closeOnClickOutside={closeOnClickOutside}
    >
      {children}
    </Modal>
  )
}
