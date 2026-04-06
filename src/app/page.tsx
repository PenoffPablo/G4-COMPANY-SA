'use client';

import Link from 'next/link';
import Image from 'next/image';
import Footer from '@/components/Footer';
import ThemeToggle from '@/components/ThemeToggle';
import ThemeLogo from '@/components/ThemeLogo';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface-primary">
      <main className="flex-1 w-full overflow-hidden">
        {/* Hero */}
        <section className="relative overflow-hidden min-h-[85vh] flex items-center justify-center px-6">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/barco-banner.webp"
              alt="Avión sobrevolando contenedores de carga"
              fill
              className="object-cover"
              priority
              quality={100}
            />
            {/* Overlays — work for both light & dark mode */}
            <div className="absolute inset-0 bg-black/60" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70" />
          </div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-black/30 backdrop-blur-sm mb-8 animate-fade-in text-g4-red uppercase tracking-widest text-[10px] font-bold">
              <span className="w-2 h-2 rounded-full bg-g4-red animate-pulse-alert" />
              VISIÓN GLOBAL DE NEGOCIOS
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-tight mb-6 animate-fade-in delay-1 tracking-tight drop-shadow-lg">
              G4 <span className="text-g4-red">COMPANY S.A</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-10 animate-fade-in delay-2 leading-relaxed drop-shadow-md">
              No vendemos servicios aislados de logística o intermediación. <strong className="text-white">Diseñamos y gestionamos el acceso real a mercados</strong>,
              actuando como tu Departamento de Exportación y Desarrollo Comercial Externalizado.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in delay-3">
              <a href="#contacto" className="px-8 py-3.5 rounded-sm bg-g4-red text-white font-bold uppercase tracking-wide text-sm hover:bg-g4-red-dark hover:-translate-y-0.5 transition-all duration-300 shadow-lg shadow-g4-red/25">
                Contactanos
              </a>
              <a href="#about" className="px-8 py-3.5 rounded-sm border border-white/25 text-white font-bold uppercase tracking-wide text-sm hover:bg-white/10 backdrop-blur-sm transition-all duration-300">
                Conocenos
              </a>
            </div>
          </div>
        </section>

        {/* Quiénes Somos */}
        <section className="py-24 px-6 relative border-t border-border-primary" id="about">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 relative z-10">
              <h2 className="text-4xl md:text-6xl font-black text-text-primary mb-4 uppercase tracking-tighter">Sobre Nosotros</h2>
              <div className="h-1 w-24 bg-g4-red mx-auto rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
              {/* Image */}
              <div className="relative rounded-none overflow-hidden min-h-[350px] lg:min-h-[unset]">
                <Image
                  src="/trabajadores.webp"
                  alt="Equipo de trabajo en almacén logístico"
                  fill
                  className="object-cover"
                  quality={85}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-g4-red/90 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    Nuestro Equipo
                  </span>
                </div>
              </div>
              {/* Text */}
              <div className="bg-surface-card border border-border-primary p-10 rounded-none relative flex items-center">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <svg className="w-40 h-40" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" /></svg>
                </div>
                <p className="text-xl md:text-2xl text-text-primary leading-relaxed text-center font-light">
                  <strong className="font-bold text-g4-red">Somos G4 COMPANY S.A</strong>, una firma especializada en apertura y desarrollo de mercados para
                  empresas productivas con alto valor agregado que buscan <strong className="font-bold text-g4-red">internacionalizarse sin aumentar su estructura interna ni asumir riesgos innecesarios</strong>.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Misión y Visión */}
        <section className="py-24 px-6 border-y border-border-primary" id="mision-vision">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-black text-text-primary mb-4 uppercase tracking-tighter">Misión y Visión</h2>
              <div className="h-1 w-24 bg-g4-red mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Misión */}
              <div className="relative bg-surface-card border border-border-primary rounded-none overflow-hidden group hover:border-g4-red/30 transition-all duration-300">
                <div className="h-2 bg-g4-red w-full"></div>
                <div className="p-10">
                  <h3 className="text-3xl font-black text-text-primary uppercase tracking-tight mb-2">Misión</h3>
                  <div className="h-0.5 w-16 bg-g4-red mb-6"></div>
                  <p className="text-text-secondary text-base leading-relaxed">
                    Nuestra propuesta está orientada a empresas que producen calidad, pero que carecen de tiempo, estructura o know-how para transformar esa calidad en ventas sostenibles en mercados competitivos. Ofrecemos un modelo de gestión comercial y exportadora externalizada, adaptable a distintos sectores productivos.
                  </p>
                </div>
              </div>

              {/* Visión */}
              <div className="relative bg-surface-card border border-border-primary rounded-none overflow-hidden group hover:border-g4-red/30 transition-all duration-300">
                <div className="h-2 bg-g4-red w-full"></div>
                <div className="p-10">
                  <h3 className="text-3xl font-black text-text-primary uppercase tracking-tight mb-2">Visión</h3>
                  <div className="h-0.5 w-16 bg-g4-red mb-6"></div>
                  <ul className="space-y-4">
                    {[
                      'Establecer el negocio y competir en el mercado.',
                      'Presencia activa en las redes sociales.',
                      'Convertirse en un HAV logístico de exportación e importación multi-productos (vino, café, etc.) en Sudamérica.',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-text-secondary text-base leading-relaxed">
                        <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-g4-red mt-2.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Propuesta */}
        <section className="py-24 px-6 border-y border-border-primary">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              {/* Texto Promesa */}
              <div className="animate-fade-in group">
                <div className="w-16 h-16 rounded-2xl border border-g4-red flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-g4-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-black text-text-primary mb-6 tracking-tight">Exportación Externalizada, Alineada a Resultados.</h3>
                <p className="text-text-secondary leading-relaxed text-lg mb-6">
                  No vendemos servicios aislados de logística, marketing o intermediación. Nosotros nos integramos directamente
                  a sus objetivos corporativos.
                </p>
                <ul className="space-y-4">
                  {[
                    'Desarrollo Comercial Integral.',
                    'Apertura real de nuevos mercados.',
                    'Operación Logística controlada punto a punto.',
                    'Reducción drástica de riesgos operativos.'
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-text-primary font-medium">
                      <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-g4-red mt-2.5">
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tarjeta Visual — Terminal de Contenedores */}
              <div className="relative rounded-none overflow-hidden animate-fade-in delay-2 min-h-[400px]">
                <Image
                  src="/containers.webp"
                  alt="Terminal de contenedores con grúas portuarias"
                  fill
                  className="object-cover"
                  quality={85}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-none bg-g4-red flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-black text-white uppercase tracking-tight">Visión Global</h4>
                  </div>
                  <p className="text-white/80 text-sm leading-relaxed">
                    Transformamos su potencial productivo local en presencia ejecutiva internacional, garantizando una penetración de mercado sólida y continua.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sectores Productivos — Grid Interactiva con imágenes 1-6.png */}
        <section className="py-24 px-6 border-t border-border-primary" id="sectores">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 px-4">
              <p className="text-g4-red text-xs font-bold uppercase tracking-[0.3em] mb-4">Conectamos Mercados</p>
              <h2 className="text-4xl md:text-6xl font-black text-text-primary mb-4 uppercase tracking-tighter">Sectores Productivos</h2>
              <div className="h-1 w-24 bg-g4-red mx-auto rounded-full"></div>
              <p className="text-text-secondary text-lg max-w-2xl mx-auto mt-6 leading-relaxed">
                Trabajamos con industrias de alto valor agregado que buscan posicionarse en el mercado internacional.
              </p>
            </div>

            <div className="relative rounded-none overflow-hidden shadow-2xl border border-border-primary">
              {/* Single unified background image for the entire grid */}
              <div className="absolute inset-0 z-0">
                <Image
                  src="/containers.webp"
                  alt="Terminal de contenedores"
                  fill
                  className="object-cover"
                  quality={90}
                />
              </div>

              {/* The grid container now has the divider background */}
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0.5 bg-white/30">
                {[
                  { id: '1', img: '/1.webp', title: 'Vitivinicultura y bebidas premium' },
                  { id: '2', img: '/2.webp', title: 'Agroindustria especializada' },
                  { id: '3', img: '/3.webp', title: 'Alimentos gourmet y orgánicos' },
                  { id: '4', img: '/4.webp', title: 'Manufactura de nicho' },
                  { id: '5', img: '/5.webp', title: 'Economía creativa y marcas con identidad' },
                  { id: '6', img: '/6.webp', title: 'Proyectos productivos con enfoque sostenible' },
                ].map((sector) => (
                  <div key={sector.id} className="group relative h-[320px] flex items-center justify-center text-center p-8 transition-all duration-500 bg-g4-red/80 hover:bg-g4-red/70">
                    <div className="flex flex-col items-center gap-6 animate-fade-in relative z-10">
                      <div className="w-20 h-20 relative transition-transform duration-500 group-hover:-translate-y-2">
                        <Image
                          src={sector.img}
                          alt=""
                          fill
                          className="object-contain brightness-0 invert"
                          quality={90}
                        />
                      </div>
                      <h3 className="text-lg font-black text-white leading-tight uppercase tracking-wide group-hover:tracking-widest transition-all duration-500 max-w-[200px]">
                        {sector.title}
                      </h3>
                      {/* Industrial accent line */}
                      <div className="w-8 h-1 bg-white opacity-40 group-hover:w-16 group-hover:opacity-100 transition-all duration-500" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Áreas de Negocio */}
        <section className="py-24 px-6 relative" id="areas">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-black text-text-primary mb-4 uppercase tracking-tighter">Áreas de Negocio</h2>
              <div className="h-1 w-24 bg-g4-red mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* 01 — Área Financiera e Inversiones */}
              <div className="relative bg-g4-red border border-border-primary rounded-none p-8 group transition-all duration-300 overflow-hidden shadow-xl">
                <span className="absolute top-4 right-6 text-[80px] font-black leading-none text-white/[0.08] select-none pointer-events-none">01</span>
                <div className="w-12 h-12 rounded-none border border-white flex items-center justify-center mb-5">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-black text-white uppercase tracking-wide mb-1">Área Financiera<br />e Inversiones</h3>
                <p className="text-white/80 text-xs font-bold uppercase tracking-wider mb-4">Dir. Sheyla Hilda Ramos Avendaño</p>
                <p className="text-white text-sm leading-relaxed mb-6 italic">
                  Estructuramos el modelo financiero de tu expansión internacional. Evaluamos riesgos, diseñamos esquemas de inversión y aseguramos que cada movimiento esté respaldado por números sólidos y proyecciones reales.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Inversión', 'ROI', 'Riesgo', 'Financiamiento'].map(tag => (
                    <span key={tag} className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white border border-white/30 rounded-none">{tag}</span>
                  ))}
                </div>
              </div>

              {/* 02 — Desarrollo de Productos y Capacitación */}
              <div className="relative bg-surface-card border border-border-primary rounded-none p-8 group hover:border-g4-red transition-all duration-300 overflow-hidden shadow-xl">
                <span className="absolute top-4 right-6 text-[80px] font-black leading-none text-text-primary/[0.04] select-none pointer-events-none">02</span>
                <div className="w-12 h-12 rounded-none border border-g4-red flex items-center justify-center mb-5">
                  <svg className="w-6 h-6 text-g4-red" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                  </svg>
                </div>
                <h3 className="text-xl font-black text-text-primary uppercase tracking-wide mb-1">Desarrollo de Productos<br />y Capacitación</h3>
                <p className="text-g4-red text-xs font-bold uppercase tracking-wider mb-4">Dir. Mauro Emiliano Aguirre</p>
                <p className="text-text-secondary text-sm leading-relaxed mb-6">
                  Adaptamos tus productos a los estándares y exigencias de los mercados internacionales. Capacitamos a tu equipo para que la expansión sea sostenible y tu producto compita en condiciones óptimas.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Desarrollo', 'Capacitación', 'Estándares', 'Calidad'].map(tag => (
                    <span key={tag} className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-text-secondary border border-border-secondary rounded-none">{tag}</span>
                  ))}
                </div>
              </div>

              {/* 03 — Área de Comercio Internacional */}
              <div className="relative bg-surface-card border border-border-primary rounded-none p-8 group hover:border-g4-red transition-all duration-300 overflow-hidden shadow-xl">
                <span className="absolute top-4 right-6 text-[80px] font-black leading-none text-text-primary/[0.04] select-none pointer-events-none">03</span>
                <div className="w-12 h-12 rounded-none border border-g4-red flex items-center justify-center mb-5">
                  <svg className="w-6 h-6 text-g4-red" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                  </svg>
                </div>
                <h3 className="text-xl font-black text-text-primary uppercase tracking-wide mb-1">Área de Comercio<br />Internacional</h3>
                <p className="text-g4-red text-xs font-bold uppercase tracking-wider mb-4">Dir. Micca Jose Sebastián</p>
                <p className="text-text-secondary text-sm leading-relaxed mb-6">
                  Diseñamos la estrategia de entrada a mercados. Identificamos canales y socios prioritarios, gestionamos negociaciones y cerramos acuerdos comerciales que generen valor real y posicionamiento duradero.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Exportación', 'Mercados', 'Distribución', 'B2B'].map(tag => (
                    <span key={tag} className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-text-secondary border border-border-secondary rounded-none">{tag}</span>
                  ))}
                </div>
              </div>

              {/* 04 — Logística y Distribución */}
              <div className="relative bg-g4-red border border-border-primary rounded-none p-8 group transition-all duration-300 overflow-hidden shadow-xl">
                <span className="absolute top-4 right-6 text-[80px] font-black leading-none text-white/[0.08] select-none pointer-events-none">04</span>
                <div className="w-12 h-12 rounded-none border border-white flex items-center justify-center mb-5">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.07-.504 1.07-1.125V14.25m-17.25 0h10.5c.621 0 1.125-.504 1.125-1.125V6.375c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v6.75c0 .621.504 1.125 1.125 1.125zm12.75 0h1.5c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125h-1.5a1.125 1.125 0 00-1.125 1.125v3.75c0 .621.504 1.125 1.125 1.125z" />
                  </svg>
                </div>
                <h3 className="text-xl font-black text-white uppercase tracking-wide mb-1">Logística<br />y Distribución</h3>
                <p className="text-white/80 text-xs font-bold uppercase tracking-wider mb-4">Dir. Pablo Javier Quiroga</p>
                <p className="text-white text-sm leading-relaxed mb-6 italic">
                  Coordinamos toda la cadena logística de exportación e importación: cumplimiento aduanero, trazabilidad, tiempos de entrega y costos optimizados. Tu producto llega donde tiene que llegar, cuando tiene que llegar.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Aduana', 'Supply Chain', 'Trazabilidad', 'Last Mile'].map(tag => (
                    <span key={tag} className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white border border-white/30 rounded-none">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cómo Trabajamos */}
        <section className="relative py-24 border-y border-border-primary overflow-hidden" id="metodologia">
          {/* Background image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/ewanvong-shipment-7797181_1920.webp"
              alt="Camiones de carga en terminal de contenedores"
              fill
              className="object-cover transition-all duration-300"
              quality={75}
              style={{
                filter: `brightness(var(--methodology-img-brightness)) contrast(var(--methodology-img-contrast))`,
                opacity: `var(--methodology-img-opacity)`
              }}
            />
            {/* Theme-aware overlay: dark mode = dark overlay, light mode = white overlay */}
            <div className="absolute inset-0 bg-surface-primary/[0.93]" />
          </div>
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="mb-16">
              <p className="text-g4-red text-xs font-bold uppercase tracking-[0.3em] mb-3">Metodología</p>
              <h2 className="text-4xl md:text-6xl font-black text-text-primary uppercase tracking-tighter mb-4">Cómo Trabajamos.</h2>
              <p className="text-text-secondary text-lg max-w-xl leading-relaxed">
                Un proceso probado que convierte productos locales en marcas internacionales competitivas.
              </p>
            </div>

            {/* Timeline */}
            <div className="relative">
              {/* Línea horizontal */}
              <div className="hidden md:block absolute top-[52px] left-0 right-0 h-[2px] bg-border-primary" />

              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6">
                {[
                  {
                    num: '01',
                    title: 'Diagnóstico',
                    desc: 'Analizamos tu empresa, producto y mercados objetivo. Identificamos brechas y oportunidades reales.',
                  },
                  {
                    num: '02',
                    title: 'Estrategia',
                    desc: 'Diseñamos el plan de acceso al mercado: canales, socios, precios y hoja de ruta a 90 días.',
                  },
                  {
                    num: '03',
                    title: 'Ejecución',
                    desc: 'Actuamos como tu departamento externalizado. Gestionamos todo el proceso operativo y comercial.',
                  },
                  {
                    num: '04',
                    title: 'Resultados',
                    desc: 'Medimos KPIs clave: tiempos de ciclo, tasa aduanera, costos logísticos y clientes cerrados.',
                  },
                ].map((step, i) => (
                  <div key={i} className="flex flex-col items-center text-center group">
                    {/* Número en cuadrado rojo */}
                    <div className="relative z-10 w-[72px] h-[72px] rounded-none bg-g4-red flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300">
                      <span className="text-white text-2xl font-black">{step.num}</span>
                    </div>
                    {/* Punto en la línea (desktop) */}
                    <div className="hidden md:block w-3 h-3 rounded-full bg-g4-red border-2 border-surface-primary -mt-[9px] mb-6 relative z-10" />
                    <h4 className="text-base font-black text-text-primary uppercase tracking-wider mb-3">{step.title}</h4>
                    <p className="text-text-secondary text-sm leading-relaxed max-w-[240px]">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contacto y Redes Sociales */}
        <section className="py-24 px-6 border-y border-border-primary" id="contacto">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-g4-red text-xs font-bold uppercase tracking-[0.3em] mb-3">Conectemos</p>
            <h2 className="text-4xl md:text-6xl font-black text-text-primary uppercase tracking-tighter mb-4">Contacto</h2>
            <p className="text-text-secondary text-lg max-w-xl mx-auto mb-10">
              ¿Listo para internacionalizar tu negocio? Escribinos para expandir tus horizontes.
            </p>

            {/* Botón grande Contactanos */}
            <a
              href="mailto:g4company.sa@gmail.com"
              className="inline-flex items-center gap-3 px-14 py-5 rounded-none bg-g4-red-dark text-white font-black text-xl uppercase tracking-wide hover:-translate-y-1 transition-all duration-300 mb-14"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              Contactanos
            </a>

            {/* Redes Sociales */}
            <p className="text-text-muted text-sm uppercase tracking-widest font-bold mb-6">Seguinos en redes</p>
            <div className="flex items-center justify-center gap-5">
              {/* Instagram */}
              <a href="https://www.instagram.com/g4company.sa?igsh=MWR0bWlqbnd0OTNjOA==" target="_blank" rel="noopener noreferrer"
                className="w-14 h-14 rounded-none bg-surface-card border border-border-primary flex items-center justify-center hover:border-g4-red hover:-translate-y-1 transition-all duration-300 group">
                <svg className="w-6 h-6 text-text-secondary group-hover:text-g4-red transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>

              {/* Facebook */}
              <a href="https://www.facebook.com/share/1EFLVJmN7K/" target="_blank" rel="noopener noreferrer"
                className="w-14 h-14 rounded-2xl bg-surface-card border border-border-primary flex items-center justify-center hover:border-g4-red hover:-translate-y-1 transition-all duration-300 group">
                <svg className="w-6 h-6 text-text-secondary group-hover:text-g4-red transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
