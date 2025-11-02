declare module 'react-identicons'

declare module '*.css' {
  const content: { [className: string]: string }
  export default content
}

// Specific declarations for the imported CSS files
declare module '@/styles/global.css'
declare module 'react-toastify/dist/ReactToastify.css'
declare module '@rainbow-me/rainbowkit/styles.css'