import React from 'react';
import styles from './Card.module.css';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    hoverable?: boolean;
}

export const Card = ({ children, className = '', hoverable = false, ...props }: CardProps) => {
    return (
        <div className={`${styles.card} ${hoverable ? styles.hoverable : ''} ${className}`} {...props}>
            {children}
        </div>
    );
};
