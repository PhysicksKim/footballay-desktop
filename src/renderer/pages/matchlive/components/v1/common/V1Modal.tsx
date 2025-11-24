import React, { useEffect, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';

interface V1ModalProps {
  isOpen: boolean;
  children: React.ReactNode;
  onClose: () => void;
  timeout?: number;
  $StyledOverlay: React.ElementType;
  $StyledContent: React.ElementType;
}

const V1Modal: React.FC<V1ModalProps> = ({
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

  /**
   * Modal이 열려있을 때, ESC 키를 누르면 Modal을 닫습니다.
   * @param e
   */
  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);

    // 이벤트 리스너를 정리(cleanup)하는 부분
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

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
      <StyledOverlay ref={nodeRef} $isOpen={isOpen}>
        <StyledContent ref={modalContentRef}>{children}</StyledContent>
      </StyledOverlay>
    </CSSTransition>
  );
};

export default V1Modal;

