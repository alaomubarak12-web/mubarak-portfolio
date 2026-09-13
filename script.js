/* ================= LOADER ================= */

const loader = document.getElementById("loader");

window.addEventListener("load", () => {

    setTimeout(() => {

        loader.classList.add("hide");

    }, 1700);

});



/* ================= CUSTOM CURSOR ================= */

const cursorDot =
    document.querySelector(".cursor-dot");

const cursorRing =
    document.querySelector(".cursor-ring");


if (
    cursorDot &&
    cursorRing &&
    window.matchMedia("(pointer: fine)").matches
) {

    let mouseX = 0;
    let mouseY = 0;

    let ringX = 0;
    let ringY = 0;


    document.addEventListener("mousemove", (event) => {

        mouseX = event.clientX;
        mouseY = event.clientY;

        cursorDot.style.left =
            `${mouseX}px`;

        cursorDot.style.top =
            `${mouseY}px`;

    });


    function animateCursor() {

        ringX +=
            (mouseX - ringX) * 0.15;

        ringY +=
            (mouseY - ringY) * 0.15;

        cursorRing.style.left =
            `${ringX}px`;

        cursorRing.style.top =
            `${ringY}px`;

        requestAnimationFrame(
            animateCursor
        );

    }

    animateCursor();


    const interactiveElements =
        document.querySelectorAll(
            "button, a"
        );


    interactiveElements.forEach((element) => {

        element.addEventListener(
            "mouseenter",
            () => {
                document.body.classList.add(
                    "cursor-hover"
                );
            }
        );

        element.addEventListener(
            "mouseleave",
            () => {
                document.body.classList.remove(
                    "cursor-hover"
                );
            }
        );

    });

}



/* ================= NAVIGATION ================= */

const nodes =
    document.querySelectorAll(".node");

const sections =
    document.querySelectorAll(
        ".content-section"
    );

const hero =
    document.querySelector(".hero");

const backButtons =
    document.querySelectorAll(
        ".back-button"
    );

let isTransitioning = false;



/* ================= OPEN SECTION ================= */

nodes.forEach((node) => {

    node.addEventListener("click", () => {

        if (isTransitioning) return;

        const sectionId =
            node.dataset.section;

        const section =
            document.getElementById(
                sectionId
            );

        if (!section) return;

        isTransitioning = true;

        hero.classList.add("opening");


        setTimeout(() => {

            sections.forEach((item) => {
                item.classList.remove(
                    "active"
                );
            });

            hero.style.display = "none";

            section.classList.add(
                "active"
            );

            window.scrollTo(0, 0);

            isTransitioning = false;

        }, 500);

    });

});



/* ================= BACK TO MAP ================= */

backButtons.forEach((button) => {

    button.addEventListener("click", () => {

        if (isTransitioning) return;

        const currentSection =
            button.closest(
                ".content-section"
            );

        if (!currentSection) return;

        isTransitioning = true;

        currentSection.classList.remove(
            "active"
        );

        window.scrollTo(0, 0);

        hero.style.display = "flex";


        requestAnimationFrame(() => {

            hero.classList.remove(
                "opening"
            );

            setTimeout(() => {

                isTransitioning = false;

            }, 500);

        });

    });

});



/* ================= SECRET HUB ================= */

const hubButton =
    document.getElementById(
        "hubButton"
    );

const secretMessage =
    document.querySelector(
        ".secret-message"
    );

const hubTitle =
    document.getElementById(
        "hubTitle"
    );

const hubSubtitle =
    document.getElementById(
        "hubSubtitle"
    );


let discovered = false;


if (
    hubButton &&
    secretMessage
) {

    hubButton.addEventListener(
        "click",
        () => {

            if (
                hero.classList.contains(
                    "collapsing"
                )
            ) {
                return;
            }


            const hubRect =
                hubButton.getBoundingClientRect();


            /*
                Calculate the exact distance
                from each node to the hub.
            */

            nodes.forEach(
                (node, index) => {

                    const nodeRect =
                        node.getBoundingClientRect();


                    const nodeCenterX =
                        nodeRect.left +
                        nodeRect.width / 2;

                    const nodeCenterY =
                        nodeRect.top +
                        nodeRect.height / 2;


                    const hubCenterX =
                        hubRect.left +
                        hubRect.width / 2;

                    const hubCenterY =
                        hubRect.top +
                        hubRect.height / 2;


                    const moveX =
                        hubCenterX -
                        nodeCenterX;

                    const moveY =
                        hubCenterY -
                        nodeCenterY;


                    const stackOffset =
                        (
                            index -
                            (nodes.length - 1) / 2
                        ) * 5;


                    node.dataset.originalTransform =
                        node.style.transform;


                    node.style.setProperty(
                        "--collapse-x",
                        `${moveX}px`
                    );

                    node.style.setProperty(
                        "--collapse-y",
                        `${moveY + stackOffset}px`
                    );


                    node.style.transitionDelay =
                        `${index * 0.04}s`;

                }
            );


            hero.classList.add(
                "collapsing"
            );


            requestAnimationFrame(() => {

                nodes.forEach((node) => {

                    node.style.transform =
                        `translate(
                            var(--collapse-x),
                            var(--collapse-y)
                        ) scale(0.35)`;

                });

            });


            /*
                Show the secret message.
            */

            setTimeout(() => {

                secretMessage.classList.add(
                    "show"
                );

                secretMessage.setAttribute(
                    "aria-hidden",
                    "false"
                );

                hero.classList.add(
                    "secret-active"
                );

            }, 850);


            /*
                Restore the constellation.
            */

            setTimeout(() => {

                secretMessage.classList.remove(
                    "show"
                );

                secretMessage.setAttribute(
                    "aria-hidden",
                    "true"
                );

                hero.classList.remove(
                    "secret-active"
                );


                nodes.forEach((node) => {

                    node.style.transform =
                        node.dataset.originalTransform ||
                        "";

                    node.style.transitionDelay =
                        "";

                });


                setTimeout(() => {

                    hero.classList.remove(
                        "collapsing"
                    );


                    nodes.forEach((node) => {

                        node.style.removeProperty(
                            "--collapse-x"
                        );

                        node.style.removeProperty(
                            "--collapse-y"
                        );

                    });

                }, 900);


                /*
                    Change the hub after the
                    first discovery.
                */

                if (!discovered) {

                    discovered = true;

                    hubTitle.textContent =
                        "YOU FOUND IT.";

                    hubSubtitle.textContent =
                        "There is more than meets the eye.";

                }

            }, 4000);

        }
    );

}