const daisyui = require('daisyui')
const typography = require('@tailwindcss/typography')

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './src/routes/**/*.{html,js,svelte,ts}',
        './src/routes/**/**/*.{html,js,svelte,ts}',
        './src/lib/components/**/*.{html,js,svelte,ts}',
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    brown: '#D59A64',
                    navy: '#2A294B',
                    lightblue: '#57BFCE',
                },
            },
        },
    },
    plugins: [require('@tailwindcss/typography'), require('daisyui')],
    daisyui: {
        themes: [
            {
                mytheme: {
                    primary: '#D59A64',
                    secondary: '#2A294B',
                    accent: '#57BFCE',
                    neutral: '#3D4451',
                    'base-100': '#FFFFFF',
                    info: '#57BFCE',
                    success: '#36D399',
                    warning: '#FBBD23',
                    error: '#F87272',
                },
            },
        ],
    },
}
