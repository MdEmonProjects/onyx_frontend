import { categoryFinishes, type CategoryArtKind } from "@/lib/catalog";
import { CaseArt } from "./CaseArt";
import styles from "./Categories.module.css";

/*
 * Drawn stand-ins for the category tiles, used until a real photo is set.
 * They use the store's own materials (banded stone, aramid, tan leather,
 * clear) so the grid reads as one family with the rest of the site.
 * Every drawing keeps the top-left corner clear for the tile text.
 */

const c = {
  onyx: "#353839",
  vein: "#242628",
  band: "#f4f4f1",
  chalk: "#e9e8e3",
  tan: "#9c6b44",
  tanLight: "#ebd4ba",
  tanDark: "#7d5434",
  sard: "#6b2531",
  steel: "#b9bdbc",
};

export function CategoryArt({ kind }: { kind: CategoryArtKind }) {
  switch (kind) {
    case "cases":
      return (
        <div className={styles.fan}>
          <CaseArt finish={categoryFinishes.tan} className={styles.fanCase} />
          <CaseArt finish={categoryFinishes.sardonyx} className={styles.fanCase} />
          <CaseArt finish={categoryFinishes.clear} camera="pill" className={styles.fanCase} />
        </div>
      );

    case "straps":
      return (
        <>
          <Scene>
            <Stitched d="M150 190C70 230 60 330 130 360" width={13} />
          </Scene>
          <CaseArt finish={categoryFinishes.onyx} className={styles.single} />
          <Scene>
            <circle cx="152" cy="190" r="9" fill="none" stroke={c.steel} strokeWidth="4" />
          </Scene>
        </>
      );

    case "magsafe":
      return (
        <>
          <CaseArt finish={categoryFinishes.clear} className={styles.single} />
          <Scene>
            <g transform="rotate(10 196 250)">
              <rect x="136" y="200" width="120" height="96" rx="16" fill={c.tan} />
              <rect x="145" y="209" width="102" height="78" rx="11" fill="none" stroke={c.tanLight} strokeWidth="1.5" strokeDasharray="4 3.5" opacity="0.85" />
              <rect x="136" y="200" width="120" height="30" rx="14" fill={c.tanDark} opacity="0.35" />
            </g>
          </Scene>
        </>
      );

    case "watch":
      return (
        <Scene>
          <WatchBand x={168} tilt={-12} strap={c.tan} stitch={c.tanLight} />
          <WatchBand x={248} tilt={-4} strap={c.onyx} stitch={c.steel} />
        </Scene>
      );

    case "earbuds":
      return (
        <Scene>
          <EarbudsCase x={160} y={112} tilt={14} body={c.onyx} />
          <EarbudsCase x={92} y={206} tilt={-8} body={c.band} />
        </Scene>
      );

    case "gift":
      return (
        <Scene wide>
          <g transform="rotate(-6 440 220)">
            <rect x="300" y="150" width="280" height="170" rx="8" fill={c.band} />
            <rect x="286" y="122" width="308" height="44" rx="6" fill={c.chalk} />
            <rect x="420" y="122" width="38" height="198" fill={c.vein} />
            <path d="M439 122c-44-58-104-40-84-6 12 20 54 14 84 6zM439 122c44-58 104-40 84-6-12 20-54 14-84 6z" fill={c.vein} />
          </g>
          <g transform="rotate(12 250 270)">
            <rect x="210" y="220" width="84" height="54" rx="6" fill={c.tan} />
            <circle cx="224" cy="247" r="5" fill={c.sard} />
            <text x="262" y="252" textAnchor="middle" fill={c.band} fontSize="11" fontWeight="700" letterSpacing="2">
              ONYX Q
            </text>
          </g>
        </Scene>
      );

    case "travel":
      return (
        <Scene wide>
          <g transform="rotate(-8 400 230)">
            <rect x="330" y="96" width="170" height="236" rx="18" fill={c.tan} />
            <rect x="342" y="108" width="146" height="212" rx="12" fill="none" stroke={c.tanLight} strokeWidth="1.6" strokeDasharray="5 4" opacity="0.85" />
            <text x="415" y="210" textAnchor="middle" fill={c.tanDark} fontSize="15" fontWeight="700" letterSpacing="4">
              ONYX Q
            </text>
          </g>
          <g transform="rotate(10 560 250)">
            <rect x="490" y="180" width="150" height="104" rx="22" fill={c.onyx} />
            <path d="M506 196h118" stroke={c.steel} strokeWidth="3" strokeDasharray="2 2.5" />
            <rect x="600" y="190" width="20" height="12" rx="3" fill={c.steel} />
          </g>
        </Scene>
      );

    case "tablet":
      return (
        <Scene>
          <g transform="rotate(-10 200 240)">
            <rect x="74" y="128" width="290" height="214" rx="22" fill={c.onyx} />
            <rect x="88" y="142" width="262" height="186" rx="12" fill={c.vein} />
            <path d="M88 142h262v40C260 230 160 170 88 250z" fill="#fff" opacity="0.05" />
            <circle cx="219" cy="135" r="2.6" fill={c.steel} />
          </g>
          <rect x="268" y="80" width="11" height="180" rx="5.5" fill={c.band} stroke="#000" strokeOpacity="0.1" transform="rotate(28 273 170)" />
        </Scene>
      );

    case "laptop":
      return (
        <Scene>
          <g transform="rotate(-9 210 240)">
            <rect x="56" y="122" width="310" height="220" rx="22" fill={c.tan} />
            <rect x="68" y="134" width="286" height="196" rx="14" fill="none" stroke={c.tanLight} strokeWidth="1.6" strokeDasharray="5 4" opacity="0.85" />
            <rect x="56" y="122" width="310" height="46" rx="22" fill={c.tanDark} opacity="0.3" />
          </g>
        </Scene>
      );
  }
}

/** A drawing surface the same shape as the tile (square or 2:1). */
function Scene({ wide, children }: { wide?: boolean; children: React.ReactNode }) {
  return (
    <svg
      className={styles.scene}
      viewBox={wide ? "0 0 640 320" : "0 0 320 320"}
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

/** A leather strap: a thick tan line with stitching down the middle. */
function Stitched({ d, width }: { d: string; width: number }) {
  return (
    <g fill="none" strokeLinecap="round">
      <path d={d} stroke={c.tan} strokeWidth={width} />
      <path d={d} stroke={c.tanLight} strokeWidth="1.4" strokeDasharray="4 3.5" opacity="0.85" />
    </g>
  );
}

function WatchBand({ x, tilt, strap, stitch }: { x: number; tilt: number; strap: string; stitch: string }) {
  return (
    <g transform={`rotate(${tilt} ${x} 200)`}>
      <rect x={x - 21} y="100" width="42" height="300" rx="14" fill={strap} />
      <rect x={x - 15} y="106" width="30" height="300" rx="10" fill="none" stroke={stitch} strokeWidth="1.3" strokeDasharray="4 3.5" opacity="0.8" />
      <g fill={c.vein} opacity="0.6">
        {[292, 312, 332].map((y) => (
          <circle key={y} cx={x} cy={y} r="3" />
        ))}
      </g>
      <rect x={x + 31} y="176" width="6" height="18" rx="3" fill={c.steel} />
      <rect x={x - 33} y="156" width="66" height="82" rx="19" fill={c.vein} stroke={c.steel} strokeWidth="2.5" />
      <rect x={x - 25} y="164" width="50" height="66" rx="13" fill="#0e0f10" />
    </g>
  );
}

function EarbudsCase({ x, y, tilt, body }: { x: number; y: number; tilt: number; body: string }) {
  return (
    <g transform={`rotate(${tilt} ${x + 65} ${y + 55})`}>
      <path d={`M${x + 22} ${y + 6}c-6-34 34-44 40-10`} fill="none" stroke={c.tan} strokeWidth="8" strokeLinecap="round" />
      <rect x={x} y={y} width="130" height="112" rx="40" fill={body} />
      <rect x={x + 0.75} y={y + 0.75} width="128.5" height="110.5" rx="39.25" fill="none" stroke="#000" strokeOpacity="0.1" strokeWidth="1.5" />
      <path d={`M${x + 4} ${y + 42}h122`} stroke="#000" strokeOpacity="0.16" strokeWidth="2" />
      <circle cx={x + 65} cy={y + 76} r="3" fill="#000" opacity="0.18" />
    </g>
  );
}
