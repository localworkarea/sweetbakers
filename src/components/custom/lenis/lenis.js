
import { addTouchAttr, addLoadedAttr, isMobile, FLS } from "@js/common/functions.js"
import Lenis from 'lenis'
import "./lenis.scss"

// Initialize Lenis
const lenis = new Lenis({
  autoRaf: true,
});

// Listen for the scroll event and log the event data
lenis.on('scroll', (e) => {
  // console.log(e);
});