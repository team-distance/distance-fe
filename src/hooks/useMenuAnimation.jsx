import { useEffect } from "react";
import { useAnimate, stagger } from "framer-motion";

const useMenuAnimation = (isOpen) => {
    const [scope, animate] = useAnimate();

    useEffect(() => {
        const menuAnimations = isOpen
            ? [
                [
                    "li",
                    { transform: "translateY(0%)", opacity: 1, filter: "blur(0px)" },
                    { delay: stagger(0.05), at: "-0.05" }
                ]
            ]
            : [
                [
                    "li",
                    { transform: "translateY(50px)", opacity: 0, filter: "blur(10px)" },
                    { delay: stagger(0.05, { from: "last" }), at: "<" }
                ]

            ];

        animate([
            [
                "path.top",
                { d: isOpen ? "M 3 16.5 L 17 2.5" : "M 2 2.5 L 20 2.5" },
                { at: "<" }
            ],
            ["path.middle", { opacity: isOpen ? 0 : 1 }, { at: "<" }],
            [
                "path.bottom",
                { d: isOpen ? "M 3 2.5 L 17 16.346" : "M 2 16.346 L 20 16.346" },
                { at: "<" }
            ],
            ...menuAnimations
        ]);
    }, [isOpen]);

    return scope;
}

export default useMenuAnimation;