import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);
const config = {
    gap: 0.08,
    speed: 0.3,
    arcRadius: 500,
};

const spotlightItems = [
    { name: "Silent Arc", img: "/img_1.jpg" },
    { name: "Bloom24", img: "/img_2.jpg" },
    { name: "Glass Fade", img: "/img_3.jpg" },
    { name: "Echo 9", img: "/img_4.jpg" },
    { name: "Velvet Loop", img: "/img_5.jpg" },
    { name: "Field Two", img: "/img_6.jpg" },
    { name: "Pale Thread", img: "/img_7.jpg" },
    { name: "Stillroom", img: "/img_8.jpg" },
    { name: "Ghostline", img: "/img_9.jpg" },
    { name: "Mono 73", img: "/img_10.jpg" },
];

const lenis = new Lenis();
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

const titlesContainer = document.querySelector(".spotlight-titles");
const imagesContainer = document.querySelector(".spotlight-images");
const spotlightHeader = document.querySelector(".spotlight-header");
const titlesContainerElement = document.querySelector(
    ".spotlight-titles-container"
);
const introTextElements = document.querySelectorAll(".spotlight-intro-text");
const imageElements = [];

spotlightItems.forEach((item, index) => {
    const titleElement = document.createElement("h1");
    titleElement.textContent = item.name;
    if (index === 0) titleElement.style.opacity = "1";
    titlesContainer.appendChild(titleElement);

    const imgWrapper = document.createElement("div");
    imgWrapper.className = "spotlight-img";
    const imgElement = document.createElement("img");
    imgElement.src = item.img;
    imgElement.alt = "";
    imgWrapper.appendChild(imgElement);
    imagesContainer.appendChild(imgWrapper);
    imageElements.push(imgWrapper);
});

const titleElements = titlesContainer.querySelectorAll("h1");
let currentActiveIndex = 0;

const containerWidth = window.innerWidth * 0.3;
const containerHeight = window.innerHeight;
const arcStartX = containerWidth - 220;
const arcStartY = -200;
const arcEndY = containerHeight + 200;
const arcControlPointX = arcStartX + config.arcRadius;
const arcControlPointY = containerHeight / 2;

function getBezierPosition(t) {
    const x = 
        (1 -t) * (1 - t) * arcStartX + 
        2 * (1 - t) * t * arcControlPointX + 
        t * t * arcStartX;
    const y = 
        (1 - t) * (1 - t) * arcStartY + 
        2 * (1 - t) * t * arcControlPointY + 
        t * t * arcEndY;
    return { x, y };
}