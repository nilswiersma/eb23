async function post_rating(person, band, rating) {
    console.log(person + " rates " + band + " with " + rating);

    await fetch("/rate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "person": person,
            "band": band,
            "rating": rating,
        })
    }).then(resp => {
        return resp.text();
    }).then(resp => {
        console.log(resp);
        if (resp == 'ok') {
            // location.reload();
        }
    });
    
}

(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
    [405],
    {
        8312: function (a, b, c) {
            (window.__NEXT_P = window.__NEXT_P || []).push([
                "/",
                function () {
                    return c(9002);
                },
            ]);
        },
        9002: function (a, b, c) {
            "use strict";
            c.r(b),
                c.d(b, {
                    __N_SSG: function () {
                        return Q;
                    },
                    default: function () {
                        return R;
                    },
                });
            var d = c(5893),
                e = c(9008),
                f = c.n(e),
                g = c(7294),
                h = c(797),
                i = (function () {
                    for (var a = [], b = 13; b < 24; b++)
                        for (var c = 0; c < 60; c++) {
                            var d = c < 10 ? "0".concat(c) : c,
                                e = b < 10 ? "0".concat(b) : b;
                            a.push("".concat(e, ":").concat(d));
                        }
                    for (var f = 0; f < 3; f++)
                        for (var g = 0; g < 60; g++) {
                            var h = g < 10 ? "0".concat(g) : g,
                                i = f < 10 ? "0".concat(f) : f;
                            a.push("".concat(i, ":").concat(h));
                        }
                    return a;
                })(),
                j = function (a) {
                    var b = new Date().getDay(),
                        c = new Date();
                    c.setDate(c.getDate() - 1);
                    var d = c.getDay();
                    return new Date().getHours() >= 0 && 6 >= new Date().getHours() && (b = d), (5 === b && "friday" === a) || (6 === b && "saturday" === a) || (0 === b && "sunday" === a);
                },
                k = function (a, b, c) {
                    var d = a.split(":"),
                        e = b.split(":"),
                        f = c.split(":"),
                        g = 60 * parseInt(d[0]) + parseInt(d[1]),
                        h = 60 * parseInt(e[0]) + parseInt(e[1]),
                        i = 60 * parseInt(f[0]) + parseInt(f[1]);
                    return i >= g && i <= h;
                },
                l = c(9153),
                m = c.n(l),
                n = c(5042),
                o = c.n(n),
                p = function (a) {
                    var b = i.indexOf(a.band.startTime),
                        c = i.indexOf(a.band.endTime),
                        e = function (a) {
                            return (0, d.jsxs)(d.Fragment, {
                                children: [
                                    (0, d.jsx)("p", { style: { position: "absolute", top: 20, left: 20 }, children: a }),
                                    (0, d.jsx)("p", { style: { position: "absolute", bottom: 20, left: 20 }, children: a }),
                                    (0, d.jsx)("p", { style: { position: "absolute", bottom: 20, right: 20 }, children: a }),
                                    (0, d.jsx)("p", { style: { position: "absolute", top: 20, right: 20 }, children: a }),
                                ],
                            });
                        },
                        bandName2 = a.band.name.length > 30 && !a.band.announcement ? a.band.name.slice(0, 30) + "..." : a.band.name;

                    var rating_click_handler = function(e) {
                        let person = document.cookie.split('=')[1];
                        if (person) {
                            let rating = prompt(a.band.name + "\n------\n" + a.band.review, "Uw emoji hier.");
                            post_rating(person, a.band.name, rating);
                        } else {
                            alert(a.band.name + "\n------\n" + a.band.review);
                        }
                    };

                    var rating_button_poop = (0, d.jsx)("button", {
                        children: ["💩"],
                        // onClick: rating_click_handler,
                    });

                    var rating_button_heart = (0, d.jsx)("button", {
                        children: ["❤️"],
                        // onClick: rating_click_handler,
                    });
              
                    var hack_div = (0, d.jsx)("div", {
                        className: "hack_div",
                        children: [rating_button_poop, rating_button_heart],
                    });
                    // document.aaa = hack_div;



                    return (0, d.jsx)("div", {
                        // onClick: function () {
                        //     a.currentlyPlaying || a.band.announcement || a.setFavorite();
                        // },
                        onClick: rating_click_handler,
                        className: [
                            o().container,
                            a.band.cancelled ? o().cancelled : !a.currentlyPlaying && a.isFavorite ? o().favorite : a.currentlyPlaying ? o().playing : a.isFavorite || a.currentlyPlaying || !a.favoritesOnly ? void 0 : o().hidden,
                            a.band.announcement && o().announcement,
                        ].join(" "),
                        style: { top: 2 * b + 40, height: (c - b) * 2 },
                        children: [//hack_div,
                            (0, d.jsxs)("div", {
                            className: [o().content, o().cancelledContent].join(" "),
                            children: [
                                (0, d.jsx)("div", { className: o().soundIcon }),
                                (0, d.jsxs)("p", { // ratings
                                    className: o().times,
                                    children: a.band.rating}),
                                (0, d.jsxs)("p", { children: [bandName2.charAt(0).toUpperCase() + bandName2.slice(1, bandName2.length), " "] }),
                                (0, d.jsxs)("p", {
                                    className: o().times,
                                    children: [a.band.cancelled ? "CANCELLED" : a.band.announcement ? "" : a.band.startTime + " - " + a.band.endTime, a.band.oui && e("oui"), "Vildhjarta" === a.band.name && e("thall")],
                                }),
                            ],
                        })],
                    });
                },
                q = p,
                r1 = function (a) {
                    var b = a.selectedDay,
                        c = a.currentTime,
                        e = a.favoritesOnly,
                        f = a.bands,
                        i = (0, g.useState)([]),
                        l = i[0],
                        n = i[1],
                        o = function (a) {
                            console.log("add or remove " + a + " to favorites")
                            window.localStorage.setItem("favoriteBands", JSON.stringify(a)), n(a);
                        };
                    (0, g.useEffect)(function () {
                        n(JSON.parse(window.localStorage.getItem("favoriteBands") || "[]"));
                    }, []);
                    var p = f,
                        r2 = function (a) {
                            var f = j(b) && k(a.startTime, a.endTime, c);
                            return (0, d.jsx)(
                                q,
                                {
                                    favoritesOnly: e,
                                    band: a,
                                    currentlyPlaying: f,
                                    isFavorite: l.includes(a.name),
                                    setFavorite: function () {
                                        l.includes(a.name)
                                            ? o(
                                                  l.filter(function (b) {
                                                      return b !== a.name;
                                                  })
                                              )
                                            : o((0, h.Z)(l).concat([a.name]));
                                    },
                                },
                                a.name
                            );
                        };
                    return (0, d.jsxs)("div", {
                        className: m().container,
                        children: [
                            (0, d.jsxs)("div", {
                                className: m().stage,
                                children: [
                                    (0, d.jsx)("h4", { children: "STAGE 1" }),
                                    p
                                        .filter(function (a) {
                                            return a.day === b && "1" === a.stage;
                                        })
                                        .map(function (a, b) {
                                            return r2(a);
                                        }),
                                ],
                            }),
                            (0, d.jsxs)("div", {
                                className: m().stage,
                                children: [
                                    (0, d.jsx)("h4", { children: "STAGE 2" }),
                                    p
                                        .filter(function (a) {
                                            return a.day === b && "2" === a.stage;
                                        })
                                        .map(function (a, b) {
                                            return r2(a);
                                        }),
                                ],
                            }),
                        ],
                    });
                },
                s = c(2699),
                t = c.n(s),
                u = function (a) {
                    var b = a.selected,
                        c = a.onSelect,
                        e = a.setFavoritesOnly,
                        f = a.favoritesOnly,
                        g = function (a) {
                            var e;
                            return (0, d.jsxs)(
                                "div",
                                {
                                    className: [t().day, b.toUpperCase() === a.toUpperCase() && t().selected].join(" "),
                                    onClick: function () {
                                        return c(a);
                                    },
                                    children: [
                                        a.charAt(0).toUpperCase() + a.slice(1),
                                        "\n",
                                    ],
                                },
                                a
                            );
                        };
                    return (0, d.jsxs)("div", {
                        className: t().container,
                        children: [
                            (0, d.jsx)("div", {
                                className: t().maxWidthContainer,
                                children: ["friday", "saturday", "sunday"].map(function (a) {
                                    return g(a);
                                }),
                            }),
                            // (0, d.jsx)("div", {
                            //     className: [t().day, t().fav, f && t().favSelected].join(" "),
                            //     onClick: function () {
                            //         e(!f);
                            //     },
                            //     children: "Favorites only",
                            // }),
                            // (0, d.jsx)("div", {
                            //     className: t().maxWidthContainer,
                            //     onClick: function(e) {
                            //         console.log("clicked " + e.innerHTML);
                            //     },
                            //     children: "Rating: " +  ["🔥", "💩", "⛽"].map(function (a) {
                            //         return "" + a;
                            //     }),
                            // }),
                        ],
                    });
                },
                v = u,
                w = c(536),
                    //     return (0, d.jsx)("div", {
                    //         className: B().container,
                    //         children: (0, d.jsxs)("div", {
                    //             className: "jsx-f1a630fdedc591e5 " + (B().image || ""),
                    //             children: [
                    //                 // (0, d.jsx)(z(), { src: C, alt: "Euroblast logo" }),
                    //                 // (0, d.jsx)("div", {
                    //                 //     className: "jsx-f1a630fdedc591e5 " + (B().euroblast2023 || ""),
                    //                 //     children: (0, d.jsx)("a", {
                    //                 //         href: "https://tickets.euroblast.net/",
                    //                 //         target: "_blank",
                    //                 //         rel: "noreferrer",
                    //                 //         onClick: function () {
                    //                 //             var a = (0, D.IH)();
                    //                 //             (0, D.Kz)(a, "press_tickets");
                    //                 //         },
                    //                 //         style: { display: "inline-block" },
                    //                 //         className: "jsx-f1a630fdedc591e5",
                    //                 //         children: "EUROBLAST 2023 - Tickets 20% off!".split("").map(function (a, b) {
                    //                 //             return (0, d.jsx)("div", { className: "jsx-f1a630fdedc591e5 " + (B().letter || ""), children: a }, a);
                    //                 //         }),
                    //                 //     }),
                    //                 // }),
                    //                 // (0, d.jsx)(x(), {
                    //                 //     id: "f1a630fdedc591e5",
                    //                 //     children:
                    //                 //         "@-webkit-keyframes blink{0%{opacity:.5}50%{opacity:1}100%{opacity:.5}}@-moz-keyframes blink{0%{opacity:.5}50%{opacity:1}100%{opacity:.5}}@-o-keyframes blink{0%{opacity:.5}50%{opacity:1}100%{opacity:.5}}@keyframes blink{0%{opacity:.5}50%{opacity:1}100%{opacity:.5}}",
                    //                 // }),
                    //             ],
                    //         }),
                    //     });
                    // },
                    // F = E,
                x = c.n(w),
                y = c(5675),
                z = c.n(y),
                A = c(422),
                B = c.n(A),
                C = {
                    // src: "/_next/static/media/euroblast.0738d578.png",
                    // height: 494,
                    // width: 2836,
                    // blurDataURL: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAABCAMAAADU3h9xAAAADFBMVEX+/v7+/v7+/v7+/v4ctB8bAAAABHRSTlOQonZrdypokAAAAAlwSFlzAAALEwAACxMBAJqcGAAAABFJREFUCJljYGJgZGRkYGAGAAArAAmQKGCpAAAAAElFTkSuQmCC",
                },
                D = c(5762),
                // E = function () {
                //     return (0, d.jsx)("div", {
                //         className: B().container,
                //         children: (0, d.jsxs)("div", {
                //             className: "jsx-f1a630fdedc591e5 " + (B().image || ""),
                //             children: [
                //                 // (0, d.jsx)(z(), { src: C, alt: "Euroblast logo" }),
                //                 // (0, d.jsx)("div", {
                //                 //     className: "jsx-f1a630fdedc591e5 " + (B().euroblast2023 || ""),
                //                 //     children: (0, d.jsx)("a", {
                //                 //         href: "https://tickets.euroblast.net/",
                //                 //         target: "_blank",
                //                 //         rel: "noreferrer",
                //                 //         onClick: function () {
                //                 //             var a = (0, D.IH)();
                //                 //             (0, D.Kz)(a, "press_tickets");
                //                 //         },
                //                 //         style: { display: "inline-block" },
                //                 //         className: "jsx-f1a630fdedc591e5",
                //                 //         children: "EUROBLAST 2023 - Tickets 20% off!".split("").map(function (a, b) {
                //                 //             return (0, d.jsx)("div", { className: "jsx-f1a630fdedc591e5 " + (B().letter || ""), children: a }, a);
                //                 //         }),
                //                 //     }),
                //                 // }),
                //                 // (0, d.jsx)(x(), {
                //                 //     id: "f1a630fdedc591e5",
                //                 //     children:
                //                 //         "@-webkit-keyframes blink{0%{opacity:.5}50%{opacity:1}100%{opacity:.5}}@-moz-keyframes blink{0%{opacity:.5}50%{opacity:1}100%{opacity:.5}}@-o-keyframes blink{0%{opacity:.5}50%{opacity:1}100%{opacity:.5}}@keyframes blink{0%{opacity:.5}50%{opacity:1}100%{opacity:.5}}",
                //                 // }),
                //             ],
                //         }),
                //     });
                // },
                // F = E,
                G = c(3867),
                H = c.n(G),
                I = function (a) {
                    var b = a.currentTime,
                        c = a.currentDay;
                    return (0, d.jsx)("div", {
                        className: H().borderContainer,
                        children: (0, d.jsx)("div", {
                            className: H().container,
                            children: i.map(function (a, e) {
                                return (0,
                                d.jsxs)("div", { children: [a === b && j(c) && (0, d.jsx)("div", { className: H().line, style: { top: 2 * e } }), (a.endsWith("00") || a.endsWith("30")) && (0, d.jsx)("div", { className: H().whiteLine, style: { top: 2 * e - 2 } }), (a.endsWith("00") || a.endsWith("30")) && (0, d.jsx)("div", { className: H().time, style: { top: 2 * e - 10 }, children: a }, e), (0, d.jsx)("div", { style: { height: 2, width: 1 } })] }, a);
                            }),
                        }),
                    });
                },
                J = I,
                K = g.useLayoutEffect,
                L = function (a, b) {
                    var c = (0, g.useRef)(a);
                    K(
                        function () {
                            c.current = a;
                        },
                        [a]
                    ),
                        (0, g.useEffect)(
                            function () {
                                if (b || 0 === b) {
                                    var a = setInterval(function () {
                                        return c.current();
                                    }, b);
                                    return function () {
                                        return clearInterval(a);
                                    };
                                }
                            },
                            [b]
                        );
                },
                M = c(7911),
                N = c.n(M),
                O = c(5503),
                P = function (a) {
                    var b,
                        c,
                        e,
                        h = function () {
                            var a = new Date(),
                                b = a.getHours(),
                                c = a.getMinutes();
                            return "".concat(b < 10 ? "0" + b : b, ":").concat(c < 10 ? "0" + c : c);
                        },
                        i = (0, g.useState)(
                            ((b = new Date().getDay()),
                            (c = new Date()),
                            c.setDate(c.getDate() - 1),
                            (e = c.getDay()),
                            (new Date().getHours() >= 0 && 6 >= new Date().getHours() && (b = e), 0 === b) ? "sunday" : 5 === b ? "friday" : 6 === b ? "saturday" : "friday")
                        ),
                        j = i[0],
                        k = i[1],
                        l = (0, g.useState)(null),
                        m = l[0],
                        n = l[1],
                        o = (0, g.useState)(!1),
                        p = o[0],
                        q = o[1];
                    return (
                        (0, g.useEffect)(function () {
                            n(h());
                            // var a = (0, O.ZF)({
                            //     apiKey: "AIzaSyD9r95WVaZtHJs5xJy1FoS6El0m4NoFvQQ",
                            //     authDomain: "euroblast-timetable.firebaseapp.com",
                            //     projectId: "euroblast-timetable",
                            //     storageBucket: "euroblast-timetable.appspot.com",
                            //     messagingSenderId: "1031752229494",
                            //     appId: "1:1031752229494:web:1ede39cecadc90f61a7557",
                            //     measurementId: "G-EWH4WPNW86",
                            // });
                            // (0, D.IH)(a);
                        }, []),
                        L(function () {
                            n(h());
                        }, 5e3),
                        (0, d.jsxs)("div", {
                            className: N().container,
                            children: [
                                (0, d.jsxs)(f(), {
                                    children: [(0, d.jsx)("title", { children: "Euroblast Timetables" }), (0, d.jsx)("link", { rel: "manifest", href: "/manifest.json" }), (0, d.jsx)("meta", { name: "theme-color", content: "#000d1e" })],
                                }),
                                // (0, d.jsx)(F, {}),
                                (0, d.jsx)(v, { selected: j, onSelect: k, favoritesOnly: p, setFavoritesOnly: q }),
                                (0, d.jsxs)("div", {
                                    className: N().timetable,
                                    children: [m && 
                                        (0, d.jsx)("div", { children: (0, d.jsx)(J, { currentTime: m, currentDay: j }) }), m && 
                                        (0, d.jsx)(r1, { bands: a.bands, selectedDay: j, currentTime: m, favoritesOnly: p })],
                                }),
                                // (0, d.jsxs)("p", {
                                //     children: [
                                //         "Made with ❤️ by",
                                //         " ",
                                //         (0, d.jsx)("a", {
                                //             href: "https://twitter.com/the_Algorithm",
                                //             target: "_blank",
                                //             rel: "noreferrer",
                                //             onClick: function () {
                                //                 var a = (0, D.IH)();
                                //                 (0, D.Kz)(a, "press_algorithm");
                                //             },
                                //             children: "R\xe9mi Gallego",
                                //         }),
                                //     ],
                                // }),
                                // (0, d.jsxs)("div", { className: N().bug, children: ["Bug report:", " ", (0, d.jsx)("a", { href: "https://twitter.com/the_Algorithm", target: "_blank", rel: "noreferrer", children: "@thealgorithm" })] }),
                                (0, d.jsx)("div", {children: document.cookie.split('=')[1]}),

                            ],
                        })
                    );
                },
                Q = !0,
                R = P;
        },
        9153: function (a) {
            a.exports = { container: "BandBlocks_container__4fm2J", stage: "BandBlocks_stage__TkON_" };
        },
        5042: function (a) {
            a.exports = {
                container: "Block_container__aYQh8",
                content: "Block_content__N0tgv",
                announcement: "Block_announcement__miwI6",
                playing: "Block_playing__salx8",
                favorite: "Block_favorite__w8fSf",
                times: "Block_times__C_ISa",
                soundIcon: "Block_soundIcon__AYGJJ",
                hidden: "Block_hidden__KA1Mf",
                cancelled: "Block_cancelled__gyaJm",
                cancelText: "Block_cancelText__6ShqJ",
                cancelledContent: "Block_cancelledContent__7XEaM",
                fadeIn: "Block_fadeIn__Rcrmp",
            };
        },
        2699: function (a) {
            a.exports = {
                container: "DaySelector_container__zcpNq",
                maxWidthContainer: "DaySelector_maxWidthContainer__qziIJ",
                day: "DaySelector_day__SjKsZ",
                fav: "DaySelector_fav__zAdaD",
                date: "DaySelector_date__tf9Nx",
                selected: "DaySelector_selected__vuEuk",
                favSelected: "DaySelector_favSelected__Fv46P",
            };
        },
        2670: function (a) {
            console.log("hello from 2670");
            a.exports = {
                container: "Hack_container__zcpNq",
                maxWidthContainer: "Hack_maxWidthContainer__qziIJ",
                day: "Hack_day__SjKsZ",
                fav: "Hack_fav__zAdaD",
                date: "Hack_date__tf9Nx",
                selected: "Hack_selected__vuEuk",
                favSelected: "Hack_favSelected__Fv46P",
            };
        },
        422: function (a) {
            a.exports = { container: "Header_container__nEsGl", image: "Header_image__1oV82", euroblast2023: "Header_euroblast2023___BdZH", blink: "Header_blink__PF2ee", move: "Header_move__6MUbU", letter: "Header_letter__KVDxL" };
        },
        3867: function (a) {
            a.exports = { container: "Ruler_container___8RB3", time: "Ruler_time__rxLYC", line: "Ruler_line__PHSEj", whiteLine: "Ruler_whiteLine__HJ65F", borderContainer: "Ruler_borderContainer__3BsQk" };
        },
        7911: function (a) {
            a.exports = {
                container: "Home_container__9RX4S",
                timetable: "Home_timetable__ok9o5",
                thall: "Home_thall__sc_nd",
                bug: "Home_bug__0SRZ6",
                marquee: "Home_marquee__pmnfn",
                marquee2: "Home_marquee2__6prZY",
                moveFromLeftToRight: "Home_moveFromLeftToRight__wGL2z",
            };
        },
    },
    function (a) {
        a.O(0, [468, 774, 888, 179], function () {
            var b;
            return a((a.s = 8312));
        }),
            (_N_E = a.O());
    },
]);
