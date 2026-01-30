import React from 'react';
import Button from './Button';

const Modal = ({
  isOpen = false,
  onClose,
  title,
  children,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  onConfirm,
  onCancel,
  showCloseButton = true,
  size = "md",
  type = "default"
}) => {
  if (!isOpen) return null;

  // Size classes
  const sizeClasses = {
    sm: "w-80",
    md: "w-96",
    lg: "w-120",
    xl: "w-140"
  };

  // Type classes for confirm button
  const typeClasses = {
    default: "primary",
    danger: "danger",
    success: "success",
    warning: "secondary"
  };

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose?.();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className={`
        card bg-white rounded-lg flex flex-col items-center justify-center p-6 gap-4
        relative overflow-hidden shadow-xl
        ${sizeClasses[size]}
        animate-in fade-in-90 zoom-in-90 duration-200
      `}>
        
        {/* Close Button */}
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Icon/Image Slot */}
        <div className="flex justify-center mb-2">
          {type === 'danger' && (
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          )}
          {type === 'success' && (
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          )}
        </div>

        {/* Title */}
        {title && (
          <h3 className="cookieHeading text-xl font-bold text-gray-900 text-center">
            {title}
          </h3>
        )}

        {/* Content */}
        <div className="cookieDescription text-sm text-gray-600 text-center leading-relaxed">
          {children}
        </div>

        {/* Actions */}
        <div className="buttonContainer flex gap-3 mt-2">
          {onCancel && (
            <Button
              variant="outline"
              size="sm"
              onClick={onCancel}
              className="min-w-20"
            >
              {cancelText}
            </Button>
          )}
          
          {onConfirm && (
            <Button
              variant={typeClasses[type]}
              size="sm"
              onClick={onConfirm}
              className="min-w-20"
            >
              {confirmText}
            </Button>
          )}
        </div>

      </div>
    </div>
  );
};

export default Modal;