import React from 'react';
import styles from './Card.module.css';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    hoverEffect?: boolean;
}

export const Card = ({ children, className = '', hoverEffect = false }: CardProps) => {
    return (
        <div className={`${styles.card} ${className}`}>
            {children}
        </div>
    );
};
