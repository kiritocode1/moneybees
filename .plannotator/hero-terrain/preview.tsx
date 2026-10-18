import { createRoot } from "react-dom/client";
import HeroTerrain from "./hero-terrain";

const hero = document.querySelector('section[aria-label="Hero"] > div');
if (!hero) throw new Error("The captured homepage has no hero figure container.");
hero.replaceChildren();
createRoot(hero).render(<HeroTerrain />);
