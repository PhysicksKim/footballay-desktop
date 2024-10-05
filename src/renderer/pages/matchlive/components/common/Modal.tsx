import React, { useEffect, useRef, MouseEvent } from 'react';
import { CSSTransition } from 'react-transition-group';

interface ModalProps {
  isOpen: boolean;
  children: React.ReactNode;
  onClose: () => void;
  $StyledOverlay: React.ElementType;
  $StyledContent: React.ElementType;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  children,
  onClose,
  $StyledOverlay: StyledOverlay,
  $StyledContent: StyledContent,
}) => {
  const modalContentRef = useRef<HTMLDivElement>(null);

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
    <CSSTransition in={isOpen} timeout={300} classNames="modal" unmountOnExit>
      <StyledOverlay>
        <StyledContent ref={modalContentRef}>{children}</StyledContent>
      </StyledOverlay>
    </CSSTransition>
  );
};

export default Modal;
