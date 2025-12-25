import React from 'react';
import styles from './Input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    containerStyle?: React.CSSProperties;
}

export const Input = ({ label, error, className = '', containerStyle, ...props }: InputProps) => {
    return (
        <div className={`${styles.container} ${className}`} style={containerStyle}>
            {label && <label className={styles.label}>{label}</label>}
            <input
                className={`${styles.input} ${error ? styles.error : ''}`}
                {...props}
            />
            {error && <span className={styles.errorMessage}>{error}</span>}
        </div>
    );
};
