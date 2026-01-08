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
                brand: {
                    cream: '#F5E8C7',
                    mint: '#A3E4BE',
                    greendark: '#2E5E4E',
                    light: '#FBFBF8',
                    brown: '#7C4F2C',
                },
            },
        },
    },
    plugins: [],
}