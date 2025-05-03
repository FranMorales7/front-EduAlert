export default function BlurBackground({ children }) {
    return (
      <div className="absolute inset-y-8 inset-x-6 ml-62 rounded-xl w-5/6 max-h-screen p-12 font-sans overflow-hidden">
        {/* Fondo blanco difuminado */}
        <div className="absolute inset-0 bg-white blur-sm z-0" />
        {/* Contenido */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    );
  }
  