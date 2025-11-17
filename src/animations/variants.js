
export const fadeUp = {
    hidden: { opacity: 0, y: 12 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
    },
};


export const fadeLeft = {
    hidden: { opacity: 0, x: -12 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
    },
};


export const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.06 } },
};