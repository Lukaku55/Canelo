// Efectos visuales del sitio. Todo es mejora progresiva: sin este archivo la página se ve y funciona igual.
// Sin dependencias: WebGL y canvas nativos. Lo pesado solo corre con mouse y mientras está en pantalla.

const raiz = document.documentElement;
const fino = matchMedia('(hover: hover) and (pointer: fine)').matches;
const quieto = matchMedia('(prefers-reduced-motion: reduce)').matches;
const oscuro = matchMedia('(prefers-color-scheme: dark)');

if (quieto) raiz.classList.add('quieto');

const $ = <T extends HTMLElement>(s: string, d: ParentNode = document) => d.querySelector<T>(s);
const $$ = <T extends HTMLElement>(s: string, d: ParentNode = document) => [...d.querySelectorAll<T>(s)];
const limitar = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

// Un solo bucle de animación para toda la página.
type Paso = (t: number) => void;
const pasos = new Set<Paso>();
const bucle = (ms: number) => {
	pasos.forEach((p) => p(ms / 1000));
	requestAnimationFrame(bucle);
};
requestAnimationFrame(bucle);

// Avisa cuando un elemento entra o sale de pantalla, para pausar lo que no se ve.
const alVer = (el: Element, fn: (visible: boolean) => void, margen = '100px') =>
	new IntersectionObserver(([e]) => fn(e.isIntersecting), { rootMargin: margen }).observe(el);

const color = (nombre: string): [number, number, number] => {
	const hex = getComputedStyle(raiz).getPropertyValue(nombre).trim().replace('#', '');
	return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255) as [number, number, number];
};

/* ---------- Tipografía: títulos por palabras, portada por letras ---------- */

function partir(el: HTMLElement, porLetras = false) {
	const texto = el.textContent!.trim().replace(/\s+/g, ' ');
	el.setAttribute('aria-label', texto);
	el.textContent = '';
	texto.split(' ').forEach((palabra, n, todas) => {
		const pal = document.createElement('span');
		pal.className = 'pal';
		pal.setAttribute('aria-hidden', 'true');
		const dentro = document.createElement('span');
		dentro.style.setProperty('--n', String(n));
		if (porLetras) {
			for (const c of palabra) {
				const letra = document.createElement('span');
				letra.className = 'letra';
				letra.textContent = c;
				dentro.append(letra);
			}
		} else dentro.textContent = palabra;
		pal.append(dentro);
		el.append(pal);
		if (n < todas.length - 1) el.append(' ');
	});
}

if (!quieto) {
	$$('main h2').forEach((h) => partir(h));
	const h1 = $('.portada h1');
	if (h1) partir(h1, true);

	// La marca del pie entra letra por letra.
	const marca = $('.pie .marca');
	if (marca?.firstChild?.nodeType === Node.TEXT_NODE) {
		const texto = marca.firstChild.textContent ?? '';
		const letras = [...texto].map((c) => {
			const s = document.createElement('span');
			s.className = 'letra';
			s.textContent = c;
			return s;
		});
		marca.firstChild.replaceWith(...letras);
		$('span:not(.letra)', marca)?.classList.add('letra');
		$$('.letra', marca).forEach((l, n) => l.style.setProperty('--n', String(n)));
	}
}

/* ---------- Revelados al hacer scroll, distintos según el elemento ---------- */

if (!quieto) {
	const reglas: [string, string][] = [
		['main h2, .portada h1', 'titulo'],
		['.bajada, .contacto .texto, .directo, .ficha .datos, details, .pie .fila, .formulario > *', 'sube'],
		['.celda', 'tarjeta'],
		['.marco', 'mascara'],
		['.paso', 'barrido'],
		['.base .lista li', 'lado'],
		['.pie .marca', 'letras'],
	];
	const observador = new IntersectionObserver(
		(entradas) =>
			entradas.forEach((e) => {
				if (!e.isIntersecting) return;
				const el = e.target as HTMLElement;
				el.classList.add('visto');
				setTimeout(() => el.classList.add('hecho'), 1800);
				observador.unobserve(el);
			}),
		{ threshold: 0.15, rootMargin: '0px 0px -6% 0px' },
	);
	reglas.forEach(([selector, tipo]) =>
		$$(selector).forEach((el) => {
			el.dataset.rev = tipo;
			const hermanos = [...el.parentElement!.children].filter((h) => (h as HTMLElement).dataset.rev === tipo);
			if (tipo !== 'titulo' && tipo !== 'mascara') el.style.setProperty('--n', String(hermanos.indexOf(el)));
			observador.observe(el);
		}),
	);
}

/* ---------- Navegación: progreso de lectura y sección activa ---------- */

{
	const enlaces = $$<HTMLAnchorElement>('.enlaces a');
	const espia = new IntersectionObserver(
		(entradas) =>
			entradas.forEach((e) => {
				if (!e.isIntersecting) return;
				enlaces.forEach((a) =>
					a.getAttribute('href') === `#${e.target.id}` ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current'),
				);
			}),
		{ rootMargin: '-45% 0px -50% 0px' },
	);
	enlaces.forEach((a) => {
		const seccion = document.getElementById(a.getAttribute('href')!.slice(1));
		if (seccion) espia.observe(seccion);
	});

	const abanico = $('.abanico');
	let ultimo = -1;
	pasos.add(() => {
		const y = scrollY;
		if (y === ultimo) return;
		ultimo = y;
		raiz.style.setProperty('--progreso', String(limitar(y / (raiz.scrollHeight - innerHeight || 1), 0, 1)));
		if (abanico && !quieto && y < innerHeight * 1.5) abanico.style.setProperty('--s', (y / innerHeight).toFixed(3));
	});
}

/* ---------- Portada: la captura que se toca pasa al frente ---------- */

{
	const hojas = $$('.abanico .hoja');
	// De atrás hacia adelante. El orden inicial es el del HTML.
	let orden = [...hojas];
	hojas.forEach((hoja) =>
		hoja.addEventListener('click', () => {
			if (orden[orden.length - 1] === hoja) return;
			orden = [...orden.filter((h) => h !== hoja), hoja];
			orden.forEach((h, i) => {
				h.classList.add('movida');
				h.style.setProperty('--i', String(i));
			});
		}),
	);
}

/* ---------- Botones: onda al hacer clic ---------- */

document.addEventListener('pointerdown', (e) => {
	const boton = (e.target as HTMLElement).closest<HTMLElement>('.boton');
	if (!boton || quieto) return;
	const r = boton.getBoundingClientRect();
	boton.style.setProperty('--ox', `${e.clientX - r.left}px`);
	boton.style.setProperty('--oy', `${e.clientY - r.top}px`);
	boton.classList.remove('onda');
	void boton.offsetWidth;
	boton.classList.add('onda');
});

/* ---------- Solo con mouse: cursor, imanes, inclinación 3D, letras ---------- */

if (fino && !quieto) {
	const puntero = { x: innerWidth / 2, y: innerHeight / 2, activo: false };
	addEventListener('pointermove', (e) => {
		puntero.x = e.clientX;
		puntero.y = e.clientY;
		puntero.activo = true;
	});

	// Aro que acompaña al cursor. El cursor del sistema sigue visible.
	const aro = document.createElement('div');
	aro.className = 'aro';
	aro.setAttribute('aria-hidden', 'true');
	document.body.append(aro);
	let ax = puntero.x;
	let ay = puntero.y;
	pasos.add(() => {
		ax += (puntero.x - ax) * 0.18;
		ay += (puntero.y - ay) * 0.18;
		aro.style.transform = `translate3d(${ax}px, ${ay}px, 0)`;
	});
	document.addEventListener('pointerover', (e) => {
		const el = e.target as HTMLElement;
		aro.classList.add('activo');
		aro.classList.toggle('sobre-campo', !!el.closest('input, textarea, select'));
		aro.classList.toggle('sobre-enlace', !!el.closest('a, button, summary'));
		aro.classList.toggle('sobre-imagen', !!el.closest('[data-liquido]'));
	});
	raiz.addEventListener('pointerleave', () => aro.classList.remove('activo'));

	// Imanes: el elemento se acerca al cursor. Usa "translate" para no pisar otros transform.
	const iman = (el: HTMLElement, fuerza: number) => {
		el.classList.add('iman');
		el.addEventListener('pointermove', (e) => {
			const r = el.getBoundingClientRect();
			const x = (e.clientX - r.left - r.width / 2) * fuerza;
			const y = (e.clientY - r.top - r.height / 2) * fuerza;
			el.style.translate = `${x.toFixed(1)}px ${y.toFixed(1)}px`;
		});
		el.addEventListener('pointerleave', () => (el.style.translate = ''));
	};
	$$('.boton, .encabezado .menu').forEach((el) => iman(el, 0.28));
	$$('.enlaces a, .encabezado .marca').forEach((el) => iman(el, 0.2));
	$$('.contacto h2').forEach((el) => iman(el, 0.04));

	// Inclinación 3D con brillo que sigue al cursor.
	const inclinar = (el: HTMLElement, grados: number) => {
		el.classList.add('inclina');
		el.addEventListener('pointermove', (e) => {
			const r = el.getBoundingClientRect();
			const px = (e.clientX - r.left) / r.width;
			const py = (e.clientY - r.top) / r.height;
			el.style.transform = `perspective(900px) rotateX(${((0.5 - py) * grados).toFixed(2)}deg) rotateY(${((px - 0.5) * grados).toFixed(2)}deg)`;
			el.style.setProperty('--bx', `${(px * 100).toFixed(1)}%`);
			el.style.setProperty('--by', `${(py * 100).toFixed(1)}%`);
		});
		el.addEventListener('pointerleave', () => (el.style.transform = ''));
	};
	$$('.celda').forEach((el) => inclinar(el, 7));
	$$('.marco').forEach((el) => inclinar(el, 5));

	// Abanico de la portada: gira en 3D según dónde esté el cursor.
	const abanico = $('.abanico');
	const portada = $('.portada');
	if (abanico && portada) {
		let rx = 0;
		let ry = 0;
		let visible = true;
		alVer(portada, (v) => (visible = v));
		pasos.add(() => {
			if (!visible) return;
			const tx = puntero.activo ? (0.5 - puntero.y / innerHeight) * 10 : 0;
			const ty = puntero.activo ? (puntero.x / innerWidth - 0.5) * 14 : 0;
			rx += (tx - rx) * 0.06;
			ry += (ty - ry) * 0.06;
			abanico.style.setProperty('--rx', `${rx.toFixed(2)}deg`);
			abanico.style.setProperty('--ry', `${ry.toFixed(2)}deg`);
		});
	}

	// Letras del título de portada: se levantan cerca del cursor.
	const letras = $$('.portada h1 .letra').map((el) => ({ el, f: 0 }));
	if (letras.length && portada) {
		let visible = true;
		alVer(portada, (v) => (visible = v), '0px');
		pasos.add(() => {
			if (!visible || !puntero.activo) return;
			for (const l of letras) {
				const r = l.el.getBoundingClientRect();
				const d = Math.hypot(puntero.x - (r.left + r.width / 2), puntero.y - (r.top + r.height / 2));
				const objetivo = Math.max(0, 1 - d / 170);
				if (Math.abs(objetivo - l.f) < 0.002) continue;
				l.f += (objetivo - l.f) * 0.14;
				l.el.style.transform = `translateY(${(-l.f * 12).toFixed(2)}px) scale(${(1 + l.f * 0.09).toFixed(3)}) rotate(${(l.f * -3).toFixed(2)}deg)`;
			}
		});
	}

	// Luz que sigue al cursor en el bloque de contacto.
	const contacto = $('.contacto');
	contacto?.addEventListener('pointermove', (e) => {
		const r = contacto.getBoundingClientRect();
		contacto.style.setProperty('--lx', `${e.clientX - r.left}px`);
		contacto.style.setProperty('--ly', `${e.clientY - r.top}px`);
	});
}

/* ---------- WebGL: utilidades ---------- */

const VERTICES = `attribute vec2 a; varying vec2 v; void main(){ v = a * .5 + .5; gl_Position = vec4(a, 0., 1.); }`;

function programa(lienzo: HTMLCanvasElement, fragmento: string) {
	const gl = lienzo.getContext('webgl', { antialias: false, premultipliedAlpha: false, powerPreference: 'low-power' });
	if (!gl) return null;
	const compilar = (tipo: number, codigo: string) => {
		const s = gl.createShader(tipo)!;
		gl.shaderSource(s, codigo);
		gl.compileShader(s);
		return s;
	};
	const p = gl.createProgram()!;
	gl.attachShader(p, compilar(gl.VERTEX_SHADER, VERTICES));
	gl.attachShader(p, compilar(gl.FRAGMENT_SHADER, fragmento));
	gl.linkProgram(p);
	if (!gl.getProgramParameter(p, gl.LINK_STATUS)) return null;
	gl.useProgram(p);
	gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
	const a = gl.getAttribLocation(p, 'a');
	gl.enableVertexAttribArray(a);
	gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);
	const u = (nombre: string) => gl.getUniformLocation(p, nombre);
	return { gl, u };
}

const ajustar = (lienzo: HTMLCanvasElement, escala: number) => {
	const ancho = Math.max(2, Math.round(lienzo.clientWidth * escala));
	const alto = Math.max(2, Math.round(lienzo.clientHeight * escala));
	if (lienzo.width !== ancho || lienzo.height !== alto) {
		lienzo.width = ancho;
		lienzo.height = alto;
		return true;
	}
	return false;
};

/* ---------- Fondo generativo de la portada ---------- */

const FONDO = `precision mediump float;
uniform vec2 r, m; uniform float t; uniform vec3 ca, cb, cc; varying vec2 v;
void main(){
	float asp = r.x / r.y;
	vec2 p = v * vec2(asp, 1.);
	float n = sin(p.x * 1.8 + t * 1.3 + sin(p.y * 2.1 - t)) + sin(p.y * 2.4 - t * 1.1 + sin(p.x * 1.6 + t * .7)) + sin((p.x + p.y) * 1.3 + t * .9);
	n = n / 6. + .5;
	float n2 = sin(p.x * 3.1 - t * 1.7 + cos(p.y * 2.7 + t * 1.2)) * .5 + .5;
	float luz = exp(-distance(p, m * vec2(asp, 1.)) * 2.4);
	float borde = smoothstep(0., .3, v.y) * smoothstep(1., .85, v.y);
	vec3 col = mix(ca, cb, smoothstep(.35, .9, n) * .2 * borde);
	col = mix(col, cc, (smoothstep(.5, 1., n2 * n) * .15 + luz * .06) * borde);
	gl_FragColor = vec4(col, 1.);
}`;

{
	const portada = $('.portada');
	if (portada) {
		const lienzo = document.createElement('canvas');
		lienzo.className = 'fondo-vivo';
		lienzo.setAttribute('aria-hidden', 'true');
		portada.prepend(lienzo);
		const g = programa(lienzo, FONDO);
		if (!g) lienzo.remove();
		else {
			const { gl, u } = g;
			const raton = { x: 0.7, y: 0.5, ox: 0.7, oy: 0.5 };
			const pintarColores = () => {
				gl.uniform3fv(u('ca'), color('--papel'));
				gl.uniform3fv(u('cb'), color('--oliva'));
				gl.uniform3fv(u('cc'), color('--terracota-texto'));
			};
			pintarColores();
			const dibujar = (t: number) => {
				if (ajustar(lienzo, 0.4)) gl.viewport(0, 0, lienzo.width, lienzo.height);
				raton.x += (raton.ox - raton.x) * 0.04;
				raton.y += (raton.oy - raton.y) * 0.04;
				gl.uniform2f(u('r'), lienzo.width, lienzo.height);
				gl.uniform2f(u('m'), raton.x, raton.y);
				gl.uniform1f(u('t'), t * 0.12);
				gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
			};
			oscuro.addEventListener('change', () => {
				pintarColores();
				if (quieto) dibujar(20);
			});
			if (quieto) dibujar(20);
			else {
				alVer(portada, (v) => (v ? pasos.add(dibujar) : pasos.delete(dibujar)));
				if (fino)
					portada.addEventListener('pointermove', (e) => {
						const r = portada.getBoundingClientRect();
						raton.ox = (e.clientX - r.left) / r.width;
						raton.oy = 1 - (e.clientY - r.top) / r.height;
					});
			}
		}
	}
}

/* ---------- Distorsión líquida sobre las capturas (solo con mouse) ---------- */

const LIQUIDO = `precision mediump float;
uniform sampler2D img; uniform vec2 m; uniform float s, t, asp; varying vec2 v;
void main(){
	vec2 a = vec2(asp, 1.);
	vec2 d = (v - m) * a;
	float dist = length(d);
	vec2 dir = dist > .0001 ? d / dist : vec2(0.);
	float onda = sin(dist * 34. - t * 5.) * exp(-dist * 4.5) * .02 * s;
	vec2 flujo = vec2(sin(v.y * 13. + t * 1.6), cos(v.x * 11. + t * 1.3)) * .0045 * s;
	vec2 p = v + dir * onda / a + flujo;
	vec2 c = dir * .005 * s * exp(-dist * 3.5) / a;
	gl_FragColor = vec4(texture2D(img, p + c).r, texture2D(img, p).g, texture2D(img, p - c).b, 1.);
}`;

if (fino && !quieto) {
	$$('[data-liquido]').forEach((marco) => {
		const img = $<HTMLImageElement>('img', marco);
		if (!img) return;
		let iniciar: (() => ReturnType<typeof crear>) | null = () => crear();
		let efecto: ReturnType<typeof crear> = null;

		function crear() {
			if (!img!.complete || !img!.naturalWidth) return null;
			const lienzo = document.createElement('canvas');
			lienzo.className = 'liquido';
			lienzo.setAttribute('aria-hidden', 'true');
			const g = programa(lienzo, LIQUIDO);
			if (!g) return null;
			const { gl, u } = g;
			try {
				gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
				gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
				gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img!);
			} catch {
				return null;
			}
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			marco.append(lienzo);
			return { lienzo, gl, u, s: 0, objetivo: 0, mx: 0.5, my: 0.5 };
		}

		const dibujar = (t: number) => {
			const e = efecto!;
			e.s += (e.objetivo - e.s) * (e.objetivo ? 0.07 : 0.05);
			if (e.objetivo === 0 && e.s < 0.004) {
				e.lienzo.classList.remove('activo');
				pasos.delete(dibujar);
				return;
			}
			if (ajustar(e.lienzo, Math.min(devicePixelRatio, 1.5))) e.gl.viewport(0, 0, e.lienzo.width, e.lienzo.height);
			e.gl.uniform2f(e.u('m'), e.mx, e.my);
			e.gl.uniform1f(e.u('s'), e.s);
			e.gl.uniform1f(e.u('t'), t);
			e.gl.uniform1f(e.u('asp'), e.lienzo.width / e.lienzo.height);
			e.gl.drawArrays(e.gl.TRIANGLE_STRIP, 0, 4);
			e.lienzo.classList.add('activo');
		};

		marco.addEventListener('pointerenter', () => {
			if (iniciar) {
				efecto = iniciar();
				if (efecto) iniciar = null;
			}
			if (!efecto) return;
			efecto.objetivo = 1;
			pasos.add(dibujar);
		});
		marco.addEventListener('pointermove', (ev) => {
			if (!efecto) return;
			const r = efecto.lienzo.getBoundingClientRect();
			efecto.mx = (ev.clientX - r.left) / r.width;
			efecto.my = 1 - (ev.clientY - r.top) / r.height;
		});
		marco.addEventListener('pointerleave', () => {
			if (efecto) efecto.objetivo = 0;
		});
	});
}

/* ---------- Partículas conectadas en el bloque oliva ---------- */

{
	const bloque = $('.base');
	if (bloque) {
		const lienzo = document.createElement('canvas');
		lienzo.className = 'particulas';
		lienzo.setAttribute('aria-hidden', 'true');
		bloque.prepend(lienzo);
		const ctx = lienzo.getContext('2d')!;
		const dpr = Math.min(devicePixelRatio, 1.5);
		const raton = { x: -999, y: -999 };
		type Punto = { x: number; y: number; vx: number; vy: number; r: number };
		let puntos: Punto[] = [];
		let ancho = 0;
		let alto = 0;

		const armar = () => {
			ancho = lienzo.clientWidth;
			alto = lienzo.clientHeight;
			lienzo.width = ancho * dpr;
			lienzo.height = alto * dpr;
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			const cantidad = Math.round(limitar((ancho * alto) / (fino ? 14000 : 26000), 14, 80));
			puntos = Array.from({ length: cantidad }, () => ({
				x: Math.random() * ancho,
				y: Math.random() * alto,
				vx: (Math.random() - 0.5) * 0.25,
				vy: (Math.random() - 0.5) * 0.25,
				r: 1 + Math.random() * 1.6,
			}));
		};

		const ALCANCE = 130;
		const dibujar = () => {
			ctx.clearRect(0, 0, ancho, alto);
			const [r, g, b] = color('--sobre-oliva').map((c) => Math.round(c * 255));
			for (const p of puntos) {
				const dx = p.x - raton.x;
				const dy = p.y - raton.y;
				const d = Math.hypot(dx, dy);
				if (d < 140 && d > 0) {
					p.x += (dx / d) * (1 - d / 140) * 1.2;
					p.y += (dy / d) * (1 - d / 140) * 1.2;
				}
				p.x += p.vx;
				p.y += p.vy;
				if (p.x < -10) p.x = ancho + 10;
				if (p.x > ancho + 10) p.x = -10;
				if (p.y < -10) p.y = alto + 10;
				if (p.y > alto + 10) p.y = -10;
			}
			for (let i = 0; i < puntos.length; i++) {
				const p = puntos[i];
				for (let j = i + 1; j < puntos.length; j++) {
					const q = puntos[j];
					const d = Math.hypot(p.x - q.x, p.y - q.y);
					if (d > ALCANCE) continue;
					ctx.strokeStyle = `rgba(${r},${g},${b},${(1 - d / ALCANCE) * 0.16})`;
					ctx.beginPath();
					ctx.moveTo(p.x, p.y);
					ctx.lineTo(q.x, q.y);
					ctx.stroke();
				}
				ctx.fillStyle = `rgba(${r},${g},${b},0.3)`;
				ctx.beginPath();
				ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
				ctx.fill();
			}
		};

		armar();
		new ResizeObserver(() => {
			armar();
			if (quieto) dibujar();
		}).observe(bloque);
		if (quieto) dibujar();
		else {
			alVer(bloque, (v) => (v ? pasos.add(dibujar) : pasos.delete(dibujar)));
			if (fino) {
				bloque.addEventListener('pointermove', (e) => {
					const rect = lienzo.getBoundingClientRect();
					raton.x = e.clientX - rect.left;
					raton.y = e.clientY - rect.top;
				});
				bloque.addEventListener('pointerleave', () => (raton.x = raton.y = -999));
			}
		}
	}
}
