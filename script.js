gsap.registerPlugin(ScrollTrigger);

const config = {
    gap: 0.08,
    speed: 0.3,
    arcRadius: 500,
};

const spotlightItems = [
    { name: "FFFFFound MMMMood", img: "./assets/back.webp" },
    { name: "Japanese Mini Trucks", img: "./assets/2.webp" },
    { name: "Listening Rooms", img: "./assets/3.webp" },
    { name: "Watchlist", img: "./assets/4.webp" },
    { name: "Cycling Fits", img: "./assets/5.webp" },
    { name: "Midjourney Inspo", img: "./assets/6.webp" },
    { name: "Porto City Guide", img: "./assets/7.webp" },
    { name: "Bookmarked", img: "./assets/8.webp" },
    { name: "Montreal Bakeries", img: "./assets/9.webp" },
    { name: "Party Couture", img: "./assets/10.webp" },
    { name: "Perfect Vessels", img: "./assets/0.webp" },
    { name: "Dream Interiors", img: "./assets/1.webp" },
];

// Lenis
const lenis = new Lenis({
    smooth: true,
});

lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// DOM
const titlesContainer = document.querySelector(".spotlight-titles");
const imagesContainer = document.querySelector(".spotlight-images");
const spotlightHeader = document.querySelector(".spotlight-header");
const titlesContainerElement = document.querySelector(".spotlight-titles-container");
const introTextElements = document.querySelectorAll(".spotlight-intro-text");
const bgImg = document.querySelector(".spotlight-bg-img img");

const imageElements = [];

spotlightItems.forEach((item, index) => {
    const title = document.createElement("h1");
    title.textContent = item.name;
    title.style.opacity = index === 0 ? "1" : "0.25";
    titlesContainer.appendChild(title);

    const imgWrap = document.createElement("div");
    imgWrap.className = "spotlight-img";

    const img = document.createElement("img");
    img.src = item.img;

    imgWrap.appendChild(img);
    imagesContainer.appendChild(imgWrap);
    imageElements.push(imgWrap);
});

const titleElements = titlesContainer.querySelectorAll("h1");
let currentActiveIndex = 0;

// Bezier setup
const containerWidth = window.innerWidth * 0.3;
const containerHeight = window.innerHeight;

const arcStartX = containerWidth - 220;
const arcStartY = -200;
const arcEndY = containerHeight + 200;

const arcControlPointX = arcStartX + config.arcRadius;
const arcControlPointY = containerHeight / 2;

function getBezierPosition(t) {
    return {
        x:
            (1 - t) * (1 - t) * arcStartX +
            2 * (1 - t) * t * arcControlPointX +
            t * t * arcStartX,
        y:
            (1 - t) * (1 - t) * arcStartY +
            2 * (1 - t) * t * arcControlPointY +
            t * t * arcEndY,
    };
}

function getImgProgressState(index, overallProgress) {
    const start = index * config.gap;
    const end = start + config.speed;

    if (overallProgress < start) return -1;
    if (overallProgress > end) return 2;

    return (overallProgress - start) / config.speed;
}

gsap.set(imageElements, { opacity: 0 });

ScrollTrigger.create({
    trigger: ".spotlight",
    start: "top top",
    end: `+=${window.innerHeight * 10}`,
    pin: true,
    scrub: 1,

    onUpdate(self) {
        const progress = self.progress;

        // Intro animation
        if (progress <= 0.2) {
            const t = progress / 0.2;
            const dist = window.innerWidth * 0.6;

            gsap.set(introTextElements[0], { x: -t * dist, opacity: 1 });
            gsap.set(introTextElements[1], { x: t * dist, opacity: 1 });

            gsap.set(".spotlight-bg-img", { scale: t });
            gsap.set(".spotlight-bg-img img", { scale: 1.5 - t * 0.5 });

            gsap.set(imageElements, { opacity: 0 });
            spotlightHeader.style.opacity = "0";

            titlesContainerElement.style.setProperty("--before-opacity", "0");
            titlesContainerElement.style.setProperty("--after-opacity", "0");
            return;
        }

        // Main
        if (progress > 0.25 && progress < 0.95) {
            spotlightHeader.style.opacity = "1";

            titlesContainerElement.style.setProperty("--before-opacity", "1");
            titlesContainerElement.style.setProperty("--after-opacity", "1");

            const switchProgress = (progress - 0.25) / 0.7;

            const vh = window.innerHeight;
            const totalHeight = titlesContainer.scrollHeight;
            const y = vh - switchProgress * (vh + totalHeight);

            gsap.set(".spotlight-titles", {
                y,
            });

            imageElements.forEach((img, i) => {
                const p = getImgProgressState(i, switchProgress);
                if (p < 0 || p > 1) {
                    gsap.set(img, { opacity: 0 });
                } else {
                    const pos = getBezierPosition(p);
                    gsap.set(img, {
                        x: pos.x - 100,
                        y: pos.y - 75,
                        opacity: 1,
                    });
                }
            });

            // Active title
            let closest = 0;
            let minDist = Infinity;

            titleElements.forEach((el, i) => {
                const rect = el.getBoundingClientRect();
                const center = rect.top + rect.height / 2;
                const d = Math.abs(center - vh / 2);
                if (d < minDist) {
                    minDist = d;
                    closest = i;
                }
            });

            if (closest !== currentActiveIndex) {
                titleElements[currentActiveIndex].style.opacity = "0.25";
                titleElements[closest].style.opacity = "1";
                bgImg.src = spotlightItems[closest].img;
                currentActiveIndex = closest;
            }
        }

        // Outro
        if (progress > 0.95) {
            spotlightHeader.style.opacity = "0";
            titlesContainerElement.style.setProperty("--before-opacity", "0");
            titlesContainerElement.style.setProperty("--after-opacity", "0");
        }
    },
});
