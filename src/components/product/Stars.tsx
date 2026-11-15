import styles from "./Stars.module.css";

const path = "M10 1.6l2.5 5.2 5.7.8-4.1 4 1 5.7L10 14.6l-5.1 2.7 1-5.7-4.1-4 5.7-.8z";

/** Read-only star row. Supports halves, e.g. 4.5. */
export function Stars({ value, size = 16 }: { value: number; size?: number }) {
  return (
    <span className={styles.row} role="img" aria-label={`${value.toFixed(1)} out of 5 stars`}>
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.max(0, Math.min(1, value - i));
        return (
          <span key={i} className={styles.star} style={{ width: size, height: size }}>
            <svg viewBox="0 0 20 20" width={size} height={size} aria-hidden="true" className={styles.empty}>
              <path d={path} />
            </svg>
            <span className={styles.fill} style={{ width: `${fill * 100}%` }}>
              <svg viewBox="0 0 20 20" width={size} height={size} aria-hidden="true">
                <path d={path} />
              </svg>
            </span>
          </span>
        );
      })}
    </span>
  );
}
