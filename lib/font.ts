import { Inter } from "next/font/google"

// If loading a variable font, you don't need to specify the font weight
export const inter = Inter({
    subsets: [
        "latin-ext",
        "cyrillic",
        "cyrillic-ext",
        "greek",
        "greek-ext",
        "latin",
        "vietnamese",
    ],
    display: "swap",
})
