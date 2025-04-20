// components/BlurWhiteBackground.jsx
export default function BlurBackground({ children }) {
    return (
      <div className="relative rounded-xl w-full h-full p-12 font-sans overflow-hidden">
        {/* Fondo blanco difuminado */}
        <div className="absolute inset-0 bg-white blur-sm z-0" />
  
        {/* Contenido */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    );
  }
  