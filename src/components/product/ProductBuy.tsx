"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { brands, caseTypes, taka, type Finish, type Product } from "@/lib/catalog";
import { site } from "@/lib/site";
import { CaseArt } from "../CaseArt";
import { useCart } from "../CartProvider";
import { CheckIcon } from "../Icons";
import { DevicePicker } from "./DevicePicker";
import { useReviews } from "./ReviewsProvider";
import styles from "./ProductBuy.module.css";

function swatch(finish: Finish) {
  return finish.pattern === "matte" || finish.pattern === "clear"
    ? finish.base
    : `linear-gradient(135deg, ${finish.base} 0 40%, ${finish.tone} 40% 56%, ${finish.base} 56%)`;
}

/**
 * Small drawing for a case-type tile. The outline gets heavier for impact
 * builds and a magnet ring appears for MagSafe ones, read from the type's id.
 * Swap it for a photo per case type when you have them.
 */
function CaseTypeGlyph({ id }: { id: string }) {
  const impact = id.includes("impact");
  const magsafe = id.includes("magsafe");
  return (
    <svg viewBox="0 0 48 48" width="44" height="44" fill="none" stroke="currentColor" aria-hidden="true">
      <rect x="13" y="5" width="22" height="38" rx="6" strokeWidth={impact ? 3 : 1.5} />
      {impact &&
        [
          [14, 6],
          [34, 6],
          [14, 42],
          [34, 42],
        ].map(([cx, cy]) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="3" fill="currentColor" stroke="none" />)}
      <rect x="17" y="9" width="8" height="8" rx="2.5" fill="currentColor" stroke="none" />
      {magsafe && (
        <>
          <circle cx="24" cy="28" r="5.5" strokeWidth="1.5" />
          <path d="M24 35.5v3" strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

type Props = {
  product: Product;
  photos: string[];
  description: string;
  specs: [string, string][];
};

export function ProductBuy({ product, photos, description, specs }: Props) {
  const { add } = useCart();
  const { reviews, average } = useReviews();

  const [finish, setFinish] = useState(product.finishes[0]);
  const [brandId, setBrandId] = useState(brands[0].id);
  // Pre-selected: the first brand's first model (Apple, iPhone 18 Pro Max).
  const [deviceId, setDeviceId] = useState(brands[0].devices[0]?.id ?? "");
  const [caseTypeId, setCaseTypeId] = useState(caseTypes[0].id);
  const [slide, setSlide] = useState(0);
  const [needDevice, setNeedDevice] = useState(false);
  const [added, setAdded] = useState(false);
  const [barShown, setBarShown] = useState(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const addRef = useRef<HTMLButtonElement>(null);

  const brand = brands.find((b) => b.id === brandId) ?? brands[0];
  const device = brand.devices.find((d) => d.id === deviceId);
  const caseType = caseTypes.find((c) => c.id === caseTypeId) ?? caseTypes[0];
  const unitPrice = product.price + caseType.extra;
  const deviceMissing = needDevice && !device;

  // Slide 0 is the drawn case in the chosen colour; the rest are photos.
  const slides = useMemo(() => [null, ...photos], [photos]);

  /* The gallery is a native scroll-snap strip, so swiping works on touch. */
  const goTo = (index: number) => {
    const stage = stageRef.current;
    if (!stage) return;
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    stage.scrollTo({ left: index * stage.clientWidth, behavior: smooth ? "smooth" : "auto" });
  };

  const onStageScroll = () => {
    const stage = stageRef.current;
    if (stage) setSlide(Math.round(stage.scrollLeft / stage.clientWidth));
  };

  // "Added" confirmation on the buttons.
  useEffect(() => {
    if (!added) return;
    const timer = setTimeout(() => setAdded(false), 1800);
    return () => clearTimeout(timer);
  }, [added]);

  /*
   * The bottom bar takes over whenever the panel's own button is off screen,
   * and steps aside again once the site footer comes into view.
   */
  useEffect(() => {
    const button = addRef.current;
    if (!button) return;
    const footer = document.querySelector("body > footer");
    let buttonSeen = true;
    let footerSeen = false;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === button) buttonSeen = entry.isIntersecting;
        else footerSeen = entry.isIntersecting;
      }
      setBarShown(!buttonSeen && !footerSeen);
    });
    observer.observe(button);
    if (footer) observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  const onAdd = () => {
    if (!device) {
      setNeedDevice(true);
      document.getElementById("device-model")?.focus();
      return;
    }
    add({ productId: product.id, finishId: finish.id, modelId: device.id, caseTypeId: caseType.id });
    setAdded(true);
  };

  const addLabel = product.soldOut ? (
    "Sold out"
  ) : added ? (
    <>
      <CheckIcon /> Added to cart
    </>
  ) : (
    "Add to cart"
  );

  return (
    <div className={styles.root}>
      <div className={styles.layout}>
        {/* ---------- Gallery ---------- */}
        <div className={styles.gallery}>
          <div className={styles.rail}>
            {slides.map((src, i) => (
              <button
                key={src ?? "art"}
                type="button"
                className={styles.thumb}
                aria-current={i === slide}
                aria-label={i === 0 ? `Show the ${finish.name} case` : `Show photo ${i}`}
                onClick={() => goTo(i)}
              >
                {src ? (
                  <Image src={src} alt="" fill sizes="108px" className={styles.photo} />
                ) : (
                  <CaseArt finish={finish} camera={device?.camera} className={styles.thumbArt} />
                )}
              </button>
            ))}
          </div>

          <div className={styles.stageWrap}>
            <div
              ref={stageRef}
              className={styles.stage}
              role="group"
              aria-label={`${product.name} images`}
              onScroll={onStageScroll}
            >
              {slides.map((src, i) => (
                <div key={src ?? "art"} className={styles.slide}>
                  {src ? (
                    <Image
                      src={src}
                      alt={`${product.name} photo ${i}`}
                      fill
                      loading={i === 1 ? "eager" : "lazy"}
                      sizes="(max-width: 960px) 100vw, 55vw"
                      className={styles.photo}
                    />
                  ) : (
                    <CaseArt
                      finish={finish}
                      camera={device?.camera}
                      label={`${product.name} in ${finish.name}`}
                      className={styles.art}
                    />
                  )}
                </div>
              ))}
            </div>

            {product.isNew && <span className={styles.tag}>New</span>}

            {/* Names the colour of the drawn case; the photos keep their own colours. */}
            {slide === 0 && (
              <span className={styles.chip}>
                <span className={styles.chipDot} style={{ background: swatch(finish) }} />
                {finish.name}
              </span>
            )}

            <div className={styles.dots}>
              {slides.map((src, i) => (
                <button
                  key={src ?? "art"}
                  type="button"
                  className={styles.dot}
                  aria-current={i === slide}
                  aria-label={`Show image ${i + 1} of ${slides.length}`}
                  onClick={() => goTo(i)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ---------- Right column ---------- */}
        <div className={styles.panel}>
          {/* Product details */}
          <section className={styles.card} aria-labelledby="product-details-heading">
            <p id="product-details-heading" className={styles.cardHead}>
              Product details
            </p>

            <div className={styles.cardBody}>
              <div className={styles.meta}>
                <div className={styles.titleRow}>
                  <h1 className={styles.name}>{product.name}</h1>
                  {reviews.length > 0 && (
                    <a
                      href="#reviews"
                      className={styles.rating}
                      aria-label={`Rated ${average.toFixed(1)} out of 5, ${reviews.length} ${
                        reviews.length === 1 ? "review" : "reviews"
                      }`}
                    >
                      <svg viewBox="0 0 20 20" width="14" height="14" aria-hidden="true">
                        <path d="M10 1.6l2.5 5.2 5.7.8-4.1 4 1 5.7L10 14.6l-5.1 2.7 1-5.7-4.1-4 5.7-.8z" />
                      </svg>
                      {average.toFixed(1)}
                      <span>({reviews.length})</span>
                    </a>
                  )}
                </div>
                <p className={styles.material}>{product.material}</p>
                <p className={styles.price}>
                  {taka(unitPrice)}
                  {caseType.extra > 0 && <span className={styles.priceNote}>with {caseType.name}</span>}
                </p>
                <p className={styles.stock}>
                  {product.soldOut ? <strong data-out="true">Sold out</strong> : <strong>In stock</strong>}{" "}
                  {site.services[0].text}
                </p>
              </div>

              {/* Brand, then model */}
              <div>
                <DevicePicker
                  id="device-model"
                  errorId="device-error"
                  brandId={brandId}
                  deviceId={deviceId}
                  invalid={deviceMissing}
                  onChange={(nextBrand, nextDevice) => {
                    setBrandId(nextBrand);
                    setDeviceId(nextDevice);
                    setNeedDevice(false);
                  }}
                />
                {deviceMissing && (
                  <p id="device-error" className={styles.error} role="alert">
                    Choose your phone model first.
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Options + add to cart */}
          <section className={`${styles.card} ${styles.cardBody}`} aria-label="Options">
            <fieldset>
              <legend className={styles.label}>Case type</legend>
              <div className={styles.types}>
                {caseTypes.map((type) => (
                  <label key={type.id} className={styles.type}>
                    <input
                      type="radio"
                      name="case-type"
                      className="srOnly"
                      checked={type.id === caseTypeId}
                      onChange={() => setCaseTypeId(type.id)}
                    />
                    <span className={styles.typeTile}>
                      <CaseTypeGlyph id={type.id} />
                    </span>
                    <span className={styles.typeName}>{type.name}</span>
                    <span className={styles.typePrice}>{taka(product.price + type.extra)}</span>
                  </label>
                ))}
              </div>
              <p className={styles.typeNote}>{caseType.note}</p>
            </fieldset>

            <fieldset>
              <legend className={styles.label}>Colour</legend>
              <div className={styles.pills}>
                {product.finishes.map((option) => (
                  <label key={option.id} className={styles.pill}>
                    <input
                      type="radio"
                      name="finish"
                      className="srOnly"
                      checked={option.id === finish.id}
                      onChange={() => {
                        setFinish(option);
                        goTo(0);
                      }}
                    />
                    <span className={styles.pillDot} style={{ background: swatch(option) }} />
                    {option.name}
                  </label>
                ))}
              </div>
            </fieldset>

            <button ref={addRef} type="button" className={styles.add} onClick={onAdd} disabled={product.soldOut}>
              {addLabel}
            </button>
            <span className="srOnly" role="status">
              {added ? "Added to cart" : ""}
            </span>
          </section>

          {/* Description + specification */}
          <section className={`${styles.card} ${styles.accordions}`} aria-label="More about this case">
            <details className={styles.acc}>
              <summary>
                Description
                <span className={styles.plus} aria-hidden="true" />
              </summary>
              <div className={styles.accBody}>
                <p>{description}</p>
              </div>
            </details>

            <details className={styles.acc} open>
              <summary>
                Specification
                <span className={styles.plus} aria-hidden="true" />
              </summary>
              <div className={styles.accBody}>
                <dl className={styles.specs}>
                  {specs.map(([term, value]) => (
                    <div key={term}>
                      <dt>{term}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </details>
          </section>
        </div>
      </div>

      {/* ---------- Bottom bar ---------- */}
      <div className={styles.bar} data-show={barShown} inert={!barShown}>
        <div className={`wrap ${styles.barInner}`}>
          <p className={styles.barInfo}>
            <span className={styles.barName}>{product.name}</span>
            <span className={styles.barPrice}>{taka(unitPrice)}</span>
          </p>
          <button type="button" className={styles.add} onClick={onAdd} disabled={product.soldOut}>
            {addLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
