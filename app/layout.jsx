import './globals.css'

export const metadata = {
  title: 'Calcula tu pronóstico de reversión',
  description: 'Evaluación gratuita para conocer tu pronóstico de reversión de diabetes',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
