import React from 'react';
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
}

export const Button = ({
    children,
    className = '',
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    ...props
}: ButtonProps) => {
    const rootClassName = `
    ${styles.button}
    ${styles[variant]}
    ${styles[size]}
    ${fullWidth ? styles.fullWidth : ''}
    ${className}
  `.trim();

    return (
        <button className={rootClassName} {...props}>
            {children}
        </button>
    );
};
