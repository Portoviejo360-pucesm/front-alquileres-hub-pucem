/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                border: "var(--card-border)",
                input: "var(--input-border)",
                ring: "var(--color-primary)",
                background: "var(--background)",
                foreground: "var(--foreground)",
                primary: {
                    DEFAULT: "var(--color-primary)",
                    foreground: "var(--text-inverted)",
                    light: "var(--color-primary-light)",
                },
                secondary: {
                    DEFAULT: "var(--color-secondary)",
                    foreground: "var(--text-inverted)",
                },
                accent: {
                    DEFAULT: "var(--color-accent)",
                    foreground: "var(--text-main)",
                },
                destructive: {
                    DEFAULT: "var(--color-error)",
                    foreground: "var(--text-inverted)",
                },
                muted: {
                    DEFAULT: "var(--card-bg)",
                    foreground: "var(--text-muted)",
                },
                card: {
                    DEFAULT: "var(--card-bg)",
                    foreground: "var(--text-main)",
                    border: "var(--card-border)",
                },
                brand: {
                    cream: '#F5E8C7',
                    mint: '#A3E4BE',
                    greendark: '#2E5E4E',
                    light: '#FBFBF8',
                    brown: '#7C4F2C',
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
        },
    },
    plugins: [],
}