import { site } from "@/lib/site";
import { ServiceGlyph } from "./Icons";
import styles from "./Services.module.css";

export function Services() {
  return (
    <section className={styles.section} aria-labelledby="services-title">
      <div className="wrap">
        <h2 id="services-title" className="srOnly">
          Delivery, payment and help
        </h2>
        <ul className={styles.grid}>
          {site.services.map((service) => (
            <li key={service.title} className={styles.item}>
              <ServiceGlyph name={service.icon} />
              <h3 className={styles.name}>{service.title}</h3>
              <p className={styles.text}>{service.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
