import React, { useEffect, useRef, MouseEvent } from 'react';
import { CSSTransition } from 'react-transition-group';

interface ModalProps {
  isOpen: boolean;
  children: React.ReactNode;
  onClose: () => void;
  timeout?: number;
  $StyledOverlay: React.ElementType;
  $StyledContent: React.ElementType;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  children,
  onClose,
  timeout = 100,
  $StyledOverlay: StyledOverlay,
  $StyledContent: StyledContent,
}) => {
  const nodeRef = useRef(null);
  const modalContentRef = useRef<HTMLElement | null>(null);

  const handleMouseDown = (e: MouseEvent) => {
    if (!modalContentRef.current) return;

    const { clientX, clientY } = e;
    const { left, right, top, bottom } =
      modalContentRef.current.getBoundingClientRect();

    if (
      clientX < left ||
      clientX > right ||
      clientY < top ||
      clientY > bottom
    ) {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener(
        'mousedown',
        handleMouseDown as unknown as EventListener,
      );
    } else {
      document.removeEventListener(
        'mousedown',
        handleMouseDown as unknown as EventListener,
      );
    }

    return () => {
      document.removeEventListener(
        'mousedown',
        handleMouseDown as unknown as EventListener,
      );
    };
  }, [isOpen]);

  return (
    <CSSTransition
      in={isOpen}
      timeout={timeout}
      classNames="modal"
      unmountOnExit
      nodeRef={nodeRef}
    >
      <StyledOverlay ref={nodeRef}>
        <StyledContent ref={modalContentRef}>{children}</StyledContent>
      </StyledOverlay>
    </CSSTransition>
  );
};

export default Modal;
