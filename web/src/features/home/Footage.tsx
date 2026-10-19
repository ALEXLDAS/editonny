import type { CSSProperties, ReactNode } from 'react';
import styles from './home.module.css';

/** Illustrative footage: a speaker silhouette against warm light. It stands in for the visitor's video; it is not a render. */
export function Footage({ className, style, children }: { className?: string; style?: CSSProperties; children?: ReactNode }) {
  return (
    <div className={`${styles.footage} ${className ?? ''}`} style={style} data-surface="media">
      <div className={`${styles.footageScene} ed-grain`} aria-hidden="true">
        <span className={styles.footageHead} />
        <span className={styles.footageBody} />
      </div>
      {children}
    </div>
  );
}
