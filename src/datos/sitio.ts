// Todo el contenido del sitio vive acá. Los componentes solo lo leen.
import marino from '../assets/trabajos/marino.png';
import sersale from '../assets/trabajos/sersale.png';
import bahiense from '../assets/trabajos/bahiense.png';

// En false el sitio pide a los buscadores que no lo indexen.
export const PUBLICAR = false;

export const negocio = {
	nombre: 'Canelo',
	descripcion:
		'Canelo diseña y programa sitios web para negocios y pymes: landings, sitios de servicios, mantenimiento y SEO local.',
	// Dominio definitivo, con https y sin barra final. Vacío hasta que se registre.
	url: '',
	// A confirmar: zona desde la que se trabaja.
	zona: 'Buenos Aires',
};

// Datos de contacto. Si falta el WhatsApp, la página muestra un aviso de borrador
// y el botón lleva al formulario.
export const contacto = {
	// Solo números, con código de país.
	whatsapp: '5491136566687',
	email: 'canelodevv@gmail.com',
	instagram: 'canelodev_',
};

export const cta = 'Pedir presupuesto';

export const navegacion = [
	{ texto: 'Servicios', href: '#servicios' },
	{ texto: 'Trabajos', href: '#trabajos' },
	{ texto: 'Cómo trabajamos', href: '#proceso' },
	{ texto: 'Preguntas', href: '#preguntas' },
];

export const portada = {
	titulo: 'Sitios web que traen consultas.',
	texto:
		'Diseñamos y programamos el sitio de tu negocio para que quien te busca te encuentre y te escriba.',
};

export const servicios = [
	{
		nombre: 'Landing de una página',
		texto:
			'Una sola página bien armada: qué hacés, por qué elegirte y un botón para escribirte. Para arrancar o para una campaña puntual.',
	},
	{
		nombre: 'Sitio de servicios',
		texto:
			'Varias páginas, una por servicio, para que cada búsqueda caiga en la página que le responde.',
	},
	{
		nombre: 'Mantenimiento mensual',
		texto:
			'Con hosting incluido. Nos ocupamos de que el sitio siga andando y al día mientras vos atendés tu negocio.',
	},
	{
		nombre: 'SEO local',
		etiqueta: 'Adicional',
		texto:
			'Perfil de Google del negocio y datos locales del sitio, para aparecer cuando te buscan cerca.',
	},
];

// "tipo" describe el vínculo real con cada negocio. Cambiarlo solo con su acuerdo.
export const trabajos = [
	{
		nombre: 'Marino Mudanzas',
		rubro: 'Mudanzas y guardamuebles',
		tipo: 'Sitio publicado',
		texto:
			'Páginas por servicio, blog, versión en inglés y pedido de presupuesto por WhatsApp.',
		enlace: { texto: 'mudanzasmarino.com.ar', href: 'https://www.mudanzasmarino.com.ar' },
		imagen: marino,
		alt: 'Portada del sitio de Marino Mudanzas, con un camión de la empresa de fondo.',
	},
	{
		nombre: 'Frigorífico Sersale',
		rubro: 'Fiambres y embutidos',
		tipo: 'Propuesta de rediseño',
		texto:
			'Sitio institucional hecho de cero, pensado para llevar al visitante al contacto comercial.',
		enlace: { texto: 'Ver la propuesta', href: 'https://frigorifico-sersale.vercel.app' },
		imagen: sersale,
		alt: 'Portada propuesta para Frigorífico Sersale, con salames de la marca de fondo.',
	},
	{
		nombre: 'El Bahiense',
		rubro: 'Aditivos e ingredientes alimentarios',
		tipo: 'Propuesta de rediseño',
		texto:
			'Sitio para empresas, con una ficha por línea de producto y contacto directo con un asesor.',
		imagen: bahiense,
		alt: 'Portada propuesta para El Bahiense, con el título Ingredientes que impulsan la industria alimentaria.',
	},
];

export const proceso = [
	{
		nombre: 'Brief',
		texto: 'Nos contás qué querés lograr y qué tiene que hacer quien entra al sitio.',
	},
	{
		nombre: 'Investigación',
		texto: 'Revisamos tu sitio actual, si tenés, y el de al menos tres competidores.',
	},
	{
		nombre: 'Diseño',
		texto: 'Armamos un boceto con tus textos y tus fotos, y lo aprobás antes de construir.',
	},
	{
		nombre: 'Construcción y control',
		texto: 'Programamos el sitio y lo pasamos por una lista de entrega antes de mostrarlo.',
	},
	{
		nombre: 'Publicación',
		texto: 'Sale en tu dominio, con la medición de consultas ya funcionando.',
	},
];

export const base = [
	{
		icono: 'cursor-click',
		nombre: 'Una acción clara',
		texto: 'Cada página lleva a un solo paso: llamarte, escribirte o pedir presupuesto.',
	},
	{
		icono: 'device-mobile',
		nombre: 'Pensado para el celular',
		texto: 'La mayoría de las consultas de un negocio local llegan desde el teléfono.',
	},
	{
		icono: 'lightning',
		nombre: 'Rápido y accesible',
		texto: 'Carga liviana, textos legibles y navegación con teclado.',
	},
	{
		icono: 'magnifying-glass',
		nombre: 'Encontrable',
		texto: 'Títulos, descripciones y datos del negocio preparados para los buscadores.',
	},
	{
		icono: 'chart-line-up',
		nombre: 'Medible',
		texto: 'Sabés cuántas consultas llegan y por qué canal.',
	},
	{
		icono: 'key',
		nombre: 'Tuyo',
		texto: 'El dominio y el hosting quedan a tu nombre o con el acceso documentado.',
	},
];

// A confirmar: las respuestas siguen los procesos internos, falta validarlas.
export const preguntas = [
	{
		pregunta: '¿Cuánto cuesta un sitio?',
		respuesta:
			'Depende del alcance: no es lo mismo una landing que un sitio de varias páginas. Contanos qué necesitás y te pasamos una propuesta por escrito, con alcance, plazo y precio.',
	},
	{
		pregunta: '¿Qué necesito tener para empezar?',
		respuesta:
			'Saber qué querés lograr con el sitio. Los textos, las fotos y los datos de contacto los definimos juntos antes de diseñar, porque el boceto se arma con contenido real.',
	},
	{
		pregunta: 'Ya tengo un sitio. ¿Sirve igual?',
		respuesta:
			'Sí. Empezamos revisando tu sitio actual y el de tu competencia para ver qué conviene conservar y qué mejorar.',
	},
	{
		pregunta: '¿Qué pasa después de publicar?',
		respuesta:
			'Podés sumar el mantenimiento mensual, que incluye el hosting, para que el sitio no quede abandonado.',
	},
];

export const contactoTextos = {
	titulo: 'Contanos qué necesita tu negocio.',
	texto: 'Escribinos por WhatsApp o dejá tus datos y armamos el mensaje por vos.',
};

export const mensajeWhatsApp = 'Hola Canelo, quiero pedir un presupuesto para un sitio web.';

export const enlaceWhatsApp = (texto = mensajeWhatsApp) =>
	contacto.whatsapp
		? `https://wa.me/${contacto.whatsapp}?text=${encodeURIComponent(texto)}`
		: '#contacto';
