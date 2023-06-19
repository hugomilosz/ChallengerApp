import { createContext, useState, useMemo } from "react";
import { createTheme } from "@mui/material/styles"

// colours (+shades)
export const tokens = (mode: string) => ({
    ...(mode === 'dark'
    ? {
        yellow: {
            100: "#fcf3d3",
            200: "#fae7a7",
            300: "#f7da7a",
            400: "#f5ce4e",
            500: "#f2c222",
            600: "#c29b1b",
            700: "#917414",
            800: "#614e0e",
            900: "#302707",
        },
        primary: {
            100: "#070706",
            200: "#0e0e0d",
            300: "#161513",
            400: "#1d1c1a",
            500: "#242320",
            600: "#504f4d",
            700: "#7c7b79",
            800: "#a7a7a6",
            900: "#f4f4f9",
        },
        blueComp: {
            100: "#f1f8fc",
            200: "#e4f2f9",
            300: "#d6ebf6",
            400: "#c9e5f3",
            500: "#bbdef0",
            600: "#96b2c0",
            700: "#708590",
            800: "#4b5960",
            900: "#252c30",
        },
        greenAcc: {
            100: "#cceded",
            200: "#99dbdb",
            300: "#66caca",
            400: "#33b8b8",
            500: "#00a6a6",
            600: "#008585",
            700: "#006464",
            800: "#004242",
            900: "#002121",
        },
        redAcc: {
            100: "#fed7d9",
            200: "#fdafb3",
            300: "#fd868c",
            400: "#fc5e66",
            500: "#fb3640",
            600: "#c92b33",
            700: "#972026",
            800: "#64161a",
            900: "#320b0d",
        },
        
    } : {
        
        yellow: {
            100: "#302707",
            200: "#614e0e",
            300: "#917414",
            400: "#c29b1b",
            500: "#f2c222",
            600: "#f5ce4e",
            700: "#f7da7a",
            800: "#fae7a7",
            900: "#fcf3d3",
        },
        primary: {
            100: "#fdfdfe",
            200: "#fbfbfd",
            300: "#f8f8fb",
            400: "#f6f6fa",
            500: "#f4f4f9",
            600: "#c3c3c7",
            700: "#929295",
            800: "#626264",
            900: "#242320",
        },
        blueComp: {
            100: "#252c30",
            200: "#4b5960",
            300: "#708590",
            400: "#96b2c0",
            500: "#bbdef0",
            600: "#c9e5f3",
            700: "#d6ebf6",
            800: "#e4f2f9",
            900: "#f1f8fc",
        },
        greenAcc: {
            100: "#002121",
            200: "#004242",
            300: "#006464",
            400: "#008585",
            500: "#00a6a6",
            600: "#33b8b8",
            700: "#66caca",
            800: "#99dbdb",
            900: "#cceded",
        },
        redAcc: {
            100: "#320b0d",
            200: "#64161a",
            300: "#972026",
            400: "#c92b33",
            500: "#fb3640",
            600: "#fc5e66",
            700: "#fd868c",
            800: "#fdafb3",
            900: "#fed7d9",
        },
    }),
});

// theme settings
export const themeSettings = (mode: string): any => {
    const colours = tokens(mode);

    return {
        palette: {
            mode: mode,
            ...(mode === 'dark'
            ? {
                primary: {
                    main:  colours.primary[500],
                },
                secondary: {
                    main:  colours.yellow[500],
                },
                error: {
                    light: colours.redAcc[300],
                    main:  colours.redAcc[500],
                    dark:  colours.redAcc[700],
                },
                success: {
                    light: colours.greenAcc[300],
                    main:  colours.greenAcc[500],
                    dark:  colours.greenAcc[700],
                },
                warning: {
                    main:  colours.redAcc[800],
                },
                info: {
                    main:  colours.blueComp[900],
                },
                neuteral: {
                    light: colours.blueComp[300],
                    main:  colours.blueComp[500],
                    dark:  colours.blueComp[700],
                },
                background: {
                    default:  colours.primary[500],
                },

            } : {
                primary: {
                    main:  colours.primary[500],
                },
                secondary: {
                    main:  colours.yellow[500],
                },
                error: {
                    light: colours.redAcc[300],
                    main:  colours.redAcc[500],
                    dark:  colours.redAcc[700],
                },
                success: {
                    light: colours.greenAcc[300],
                    main:  colours.greenAcc[500],
                    dark:  colours.greenAcc[700],
                },
                warning: {
                    main:  colours.redAcc[800],
                },
                info: {
                    main:  colours.blueComp[900],
                },
                neutral: {
                    light: colours.blueComp[300],
                    main:  colours.blueComp[500],
                    dark:  colours.blueComp[700],
                },
                background: {
                    default:  colours.primary[500],
                },
            }),
        },

        typography: {
            fontFamily: ["poppins", "sans-serif"].join(","),
            fontSize: 12,
            h1: {
                fontFamily: ["poppins", "sans-serif"].join(","),
                fontSize: 40,
            },
            h2: {
                fontFamily: ["poppins", "sans-serif"].join(","),
                fontSize: 32,
            },
            h3: {
                fontFamily: ["poppins", "sans-serif"].join(","),
                fontSize: 24,
            },
            h4: {
                fontFamily: ["poppins", "sans-serif"].join(","),
                fontSize: 20,
            },
            h5: {
                fontFamily: ["poppins", "sans-serif"].join(","),
                fontSize: 16,
            },
            h6: {
                fontFamily: ["poppins", "sans-serif"].join(","),
                fontSize: 14,
            },
            
        },

        action: {
            disabledBackground: colours.yellow[800],
        },
    };
};

// context for colour and text
export const ColourModeContext: any = createContext({
    toggleColourMode: () => {},
});

export const useMode : any = () => {
    const [mode, setMode] = useState("light");

    const colourMode = useMemo(
        () => ({
            toggleColourMode: () =>
            setMode((prev) => (prev === "light" ? "dark" : "light")),
        }),
        []
    );

    const theme = useMemo(() => createTheme(themeSettings(mode)), [mode])

    return [theme, colourMode]
}