import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

export const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    isLoading,
    className = '',
    disabled,
    ...props
}: ButtonProps) => {
    const baseClass = 'btn';
    const variantClass = `btn-${variant}`;

    // We can add size classes to globals if needed, or handle here
    const sizeStyles = {
        sm: { padding: '0.5rem 1rem', fontSize: '0.875rem' },
        md: { padding: '0.75rem 1.5rem', fontSize: '1rem' },
        lg: { padding: '1rem 2rem', fontSize: '1.125rem' }
    };

    return (
        <button
            className={`${baseClass} ${variantClass} ${className}`}
            disabled={isLoading || disabled}
            style={{ ...sizeStyles[size], opacity: (isLoading || disabled) ? 0.7 : 1 }}
            {...props}
        >
            {isLoading ? 'Loading...' : children}
        </button>
    );
};
