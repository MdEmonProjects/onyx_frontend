import buy from "./ProductBuy.module.css";
import styles from "./ProductSkeleton.module.css";

function Bone({ className }: { className: string }) {
  return <span className={`${styles.bone} ${className}`} />;
}

/**
 * Stand-in for the top of the product page while it streams in. It borrows
 * ProductBuy's layout classes, so the gallery and the card column sit exactly
 * where the real ones will land and nothing jumps when they arrive.
 */
export function ProductSkeleton() {
  return (
    <div role="status" aria-live="polite">
      <span className={styles.srOnly}>Loading product…</span>
      <div aria-hidden="true">
        <Bone className={styles.crumbs} />

        <div className={buy.root}>
          <div className={buy.layout}>
            <div className={buy.gallery}>
              <div className={buy.rail}>
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className={buy.thumb}>
                    <Bone className={styles.thumbCase} />
                  </div>
                ))}
              </div>
              <div className={`${buy.stageWrap} ${styles.stage}`}>
                <Bone className={styles.case} />
              </div>
            </div>

            <div className={buy.panel}>
              <div className={buy.card}>
                <div className={buy.cardHead}>
                  <Bone className={styles.head} />
                </div>
                <div className={buy.cardBody}>
                  <Bone className={styles.title} />
                  <Bone className={styles.line} />
                  <Bone className={styles.price} />
                  <Bone className={styles.line} />
                </div>
              </div>

              <div className={buy.card}>
                <div className={buy.cardBody}>
                  <Bone className={styles.label} />
                  <div className={styles.swatches}>
                    {[0, 1, 2, 3, 4].map((i) => (
                      <Bone key={i} className={styles.swatch} />
                    ))}
                  </div>
                  <Bone className={styles.label} />
                  <Bone className={styles.field} />
                  <Bone className={styles.field} />
                  <Bone className={styles.label} />
                  <div className={styles.tiles}>
                    {[0, 1, 2].map((i) => (
                      <Bone key={i} className={styles.tile} />
                    ))}
                  </div>
                  <Bone className={styles.button} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
