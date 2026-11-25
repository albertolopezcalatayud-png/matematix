# Matematix curriculum map: course -> subject -> block -> lessons (es titles; ca/en added when built into the app).
# Based on Decreto 106/2022 (Primaria, modified by Decreto 96/2026) and Decreto 107/2022 (ESO), Comunitat Valenciana.
M_P = ['Números y operaciones', 'Medida', 'Geometría', 'Probabilidad', 'Estadística', 'Pensamiento computacional']
MAP = {}
def C(course, subject, blocks): MAP.setdefault(course, {})[subject] = blocks

C('1P', 'Matemáticas', {
 'Números y operaciones': ['Contar hasta 20', 'Números hasta 99: decenas y unidades', 'Mayor, menor e igual', 'Anterior y posterior', 'Pares e impares', 'Sumar hasta 20', 'Restar hasta 20', 'Dobles y mitades', 'Sumar y restar decenas', 'Problemas de juntar y quitar'],
 'Medida': ['Largo y corto, alto y bajo', 'Medir con palmos y pasos', 'Pesa más, pesa menos', 'Lleno y vacío', 'Días de la semana y meses', 'Las horas en punto', 'Monedas de euro'],
 'Geometría': ['Dentro, fuera, encima, debajo', 'Derecha e izquierda', 'Líneas rectas y curvas', 'Círculo, cuadrado, triángulo y rectángulo', 'Cubo, esfera y cilindro'],
 'Probabilidad': ['Seguro, posible e imposible'],
 'Estadística': ['Contar y anotar', 'Leer pictogramas'],
 'Pensamiento computacional': ['Series y patrones', 'Seguir instrucciones paso a paso'],
})
C('2P', 'Matemáticas', {
 'Números y operaciones': ['Números hasta 999: centenas', 'Comparar y ordenar hasta 999', 'Sumar llevando', 'Restar llevando', 'Iniciación a la multiplicación: sumas repetidas', 'Tablas del 2, 5 y 10', 'Tablas del 3 y 4', 'Repartir en partes iguales', 'Problemas de dos pasos', 'Cálculo mental: sumar y restar 10 y 100'],
 'Medida': ['El metro y el centímetro', 'El kilo y el litro', 'Las horas y las medias horas', 'Calendario: días, semanas y meses', 'Euros y céntimos'],
 'Geometría': ['Polígonos: lados y vértices', 'Cuerpos geométricos: caras y aristas', 'Recorridos en una cuadrícula', 'Simetría'],
 'Probabilidad': ['¿Qué es más probable?'],
 'Estadística': ['Tablas de recuento', 'Diagramas de barras'],
 'Pensamiento computacional': ['Patrones con números', 'Algoritmos: órdenes para moverse'],
})
C('3P', 'Matemáticas', {
 'Números y operaciones': ['Números hasta 9 999: unidades de millar', 'Redondear a la decena y a la centena', 'Sumas y restas con números grandes', 'Las tablas de multiplicar', 'Multiplicar por una cifra', 'La división: reparto', 'Dividir por una cifra', 'Propiedades: orden y agrupación', 'Fracciones: la mitad, un tercio, un cuarto', 'Problemas con las cuatro operaciones'],
 'Medida': ['Metro, decímetro, centímetro y milímetro', 'Kilómetro y metro', 'Kilo, medio kilo y gramo', 'Litro, medio litro y cuarto de litro', 'El reloj: cuartos y minutos', 'Dinero: pagar y recibir el cambio'],
 'Geometría': ['Rectas paralelas y perpendiculares', 'Ángulos: recto, agudo y obtuso', 'Clasificar triángulos', 'Clasificar cuadriláteros', 'Perímetro', 'Coordenadas en una cuadrícula'],
 'Probabilidad': ['Sucesos seguros, posibles e imposibles', 'Experimentos con dados y monedas'],
 'Estadística': ['Tablas de frecuencias', 'Diagramas de barras', 'Interpretar gráficos'],
 'Pensamiento computacional': ['Patrones y reglas', 'Algoritmos con bucles'],
})
C('4P', 'Matemáticas', {
 'Números y operaciones': ['Números hasta 999 999', 'Números romanos', 'Multiplicar por dos cifras', 'Dividir por una cifra con resto', 'Prueba de la división', 'Fracciones: numerador y denominador', 'Comparar fracciones', 'Fracción de una cantidad', 'Números decimales: décimas y centésimas', 'Sumar y restar decimales', 'Problemas de varias operaciones'],
 'Medida': ['Unidades de longitud y conversiones', 'Unidades de masa y capacidad', 'Horas, minutos y segundos', 'Duración de actividades', 'Dinero con decimales'],
 'Geometría': ['Ángulos y su medida', 'Polígonos regulares', 'Circunferencia y círculo', 'Área contando cuadrados', 'Prismas y pirámides', 'Giros, traslaciones y simetrías'],
 'Probabilidad': ['Espacio muestral', 'Comparar probabilidades'],
 'Estadística': ['Moda', 'Media', 'Gráficos de barras y de líneas'],
 'Pensamiento computacional': ['Patrones y secuencias', 'Programación por bloques'],
})
C('5P', 'Matemáticas', {
 'Números y operaciones': ['Números de más de seis cifras', 'Múltiplos y divisores', 'Criterios de divisibilidad', 'Números primos y compuestos', 'Potencias', 'Fracciones equivalentes', 'Sumar y restar fracciones', 'Decimales: milésimas', 'Multiplicar y dividir decimales', 'Multiplicar y dividir por 10, 100 y 1 000', 'Porcentajes', 'Jerarquía de las operaciones'],
 'Medida': ['Sistema métrico decimal', 'Conversión de unidades', 'Superficie: m², cm², km²', 'Medida del tiempo', 'Estimar medidas'],
 'Geometría': ['Medir ángulos con el transportador', 'Área del rectángulo y el cuadrado', 'Área del triángulo', 'Coordenadas cartesianas', 'Poliedros y cuerpos redondos', 'Figuras semejantes'],
 'Probabilidad': ['Probabilidad de un suceso', 'Experimentos aleatorios'],
 'Estadística': ['Media, moda y mediana', 'Rango', 'Diagramas de sectores', 'Interpretar gráficos'],
 'Pensamiento computacional': ['Algoritmos', 'Hojas de cálculo sencillas'],
})
C('6P', 'Matemáticas', {
 'Números y operaciones': ['Números enteros: los negativos', 'Ordenar enteros en la recta', 'Potencias y raíz cuadrada', 'Mínimo común múltiplo y máximo común divisor', 'Operaciones con fracciones', 'Fracciones y decimales', 'Operaciones con decimales', 'Porcentajes y descuentos', 'Proporcionalidad directa', 'Regla de tres', 'Problemas de varias operaciones'],
 'Medida': ['Longitud, masa y capacidad: conversiones', 'Superficie y volumen', 'Relación entre volumen y capacidad', 'Tiempo: problemas con horas'],
 'Geometría': ['Área de polígonos', 'Longitud de la circunferencia: el número π', 'Área del círculo', 'Volumen de prismas', 'Escalas y planos', 'Transformaciones geométricas'],
 'Probabilidad': ['Regla de Laplace', 'Diagramas de árbol'],
 'Estadística': ['Población y muestra', 'Media, mediana, moda y rango', 'Histogramas'],
 'Pensamiento computacional': ['Algoritmos y diagramas de flujo', 'Hojas de cálculo'],
})
MEDIO = {
 '1P': {'Ciencia y seres vivos': ['Seres vivos e inertes', 'Animales: cómo son y dónde viven', 'Las plantas', 'Cuidar el medio'], 'El cuerpo humano y la salud': ['Partes del cuerpo', 'Los cinco sentidos', 'Hábitos saludables'], 'Materia, fuerza y energía': ['Materiales y sus propiedades', 'La luz y el sonido'], 'Tecnología': ['Máquinas a nuestro alrededor', 'Uso seguro de aparatos'], 'La Tierra y el universo': ['El día y la noche', 'El agua y sus estados']},
 '2P': {'Ciencia y seres vivos': ['Clasificar animales', 'Partes de la planta', 'Cadenas alimentarias sencillas', 'Reducir, reutilizar y reciclar'], 'El cuerpo humano y la salud': ['Alimentación saludable', 'Higiene y descanso'], 'Materia, fuerza y energía': ['Sólidos, líquidos y gases', 'Mezclas sencillas'], 'Tecnología': ['Máquinas simples', 'Construir estructuras'], 'La Tierra y el universo': ['El tiempo atmosférico', 'Las estaciones del año']},
 '3P': {'Ciencia y seres vivos': ['Vertebrados e invertebrados', 'Nutrición de las plantas', 'Ecosistemas', 'El método científico'], 'El cuerpo humano y la salud': ['Esqueleto y músculos', 'Las articulaciones'], 'Materia, fuerza y energía': ['Propiedades de la materia: masa y volumen', 'El calor y la temperatura', 'Fuerzas: empujar y tirar'], 'Tecnología': ['Palancas, poleas y ruedas', 'Programación sin ordenador'], 'La Tierra y el universo': ['El ciclo del agua', 'El Sistema Solar']},
 '4P': {'Ciencia y seres vivos': ['Los cinco reinos', 'Hongos y microorganismos', 'Relaciones en el ecosistema', 'Huella ecológica'], 'El cuerpo humano y la salud': ['Aparato digestivo', 'Aparato respiratorio y circulatorio'], 'Materia, fuerza y energía': ['La electricidad', 'Fuerzas y movimiento', 'Tipos de energía'], 'Tecnología': ['Circuitos eléctricos sencillos', 'Robots y programación'], 'La Tierra y el universo': ['Rocas y minerales', 'El relieve']},
 '5P': {'Ciencia y seres vivos': ['La célula', 'Clasificación de seres vivos', 'Factores bióticos y abióticos', 'Especies en peligro'], 'El cuerpo humano y la salud': ['Aparato locomotor', 'Sistema nervioso y sentidos', 'Prevenir enfermedades'], 'Materia, fuerza y energía': ['Densidad: flota o se hunde', 'La velocidad', 'La gravedad'], 'Tecnología': ['Sensores y máquinas', 'Programación por bloques'], 'La Tierra y el universo': ['La Tierra y la Luna', 'Las capas de la Tierra']},
 '6P': {'Ciencia y seres vivos': ['Funciones vitales', 'Ecosistemas y sostenibilidad', 'El método científico: experimentos'], 'El cuerpo humano y la salud': ['Aparato reproductor', 'Pubertad y cambios', 'Salud y adicciones'], 'Materia, fuerza y energía': ['Transformaciones de la energía', 'Energías renovables y no renovables', 'Cambios físicos y químicos'], 'Tecnología': ['Circuitos con interruptores', 'Impresión 3D y realidad aumentada'], 'La Tierra y el universo': ['El universo', 'El clima y el cambio climático']},
}
for c, b in MEDIO.items(): C(c, 'Conocimiento del Medio', b)

C('1E', 'Matemáticas', {
 'Números y cálculo': ['Números naturales y potencias', 'Divisibilidad: mcm y mcd', 'Números enteros', 'Operaciones con enteros', 'Fracciones', 'Operaciones con fracciones', 'Números decimales', 'Proporcionalidad y porcentajes'],
 'Álgebra': ['Lenguaje algebraico', 'Expresiones algebraicas', 'Ecuaciones de primer grado', 'Problemas con ecuaciones'],
 'Medida': ['Sistema métrico decimal', 'Estimación y errores de medida'],
 'Geometría': ['Rectas y ángulos', 'Triángulos y cuadriláteros', 'Perímetros y áreas', 'Circunferencia y círculo'],
 'Funciones': ['Coordenadas cartesianas', 'Tablas y gráficas'],
 'Probabilidad': ['Experimentos aleatorios', 'Probabilidad de Laplace'],
 'Estadística': ['Variables estadísticas', 'Tablas de frecuencias', 'Gráficos estadísticos', 'Media, mediana y moda'],
 'Pensamiento computacional': ['Patrones y secuencias', 'Algoritmos'],
})
C('2E', 'Matemáticas', {
 'Números y cálculo': ['Repaso de enteros', 'Potencias y raíces', 'Fracciones y decimales', 'Proporcionalidad directa e inversa', 'Porcentajes: aumentos y disminuciones'],
 'Álgebra': ['Polinomios', 'Identidades notables', 'Ecuaciones de primer grado', 'Ecuaciones de segundo grado', 'Sistemas de ecuaciones'],
 'Medida': ['Unidades de superficie y volumen'],
 'Geometría': ['Teorema de Pitágoras', 'Semejanza y Tales', 'Cuerpos geométricos', 'Áreas y volúmenes'],
 'Funciones': ['Concepto de función', 'Funciones lineales', 'Interpretar gráficas'],
 'Probabilidad': ['Sucesos', 'Probabilidad: tablas y árboles'],
 'Estadística': ['Frecuencias y gráficos', 'Medidas de centralización y dispersión'],
 'Pensamiento computacional': ['Algoritmos y programación'],
})
C('3E', 'Matemáticas', {
 'Números y cálculo': ['Números racionales', 'Potencias de exponente entero', 'Notación científica', 'Radicales', 'Errores y aproximaciones'],
 'Álgebra': ['Polinomios: operaciones', 'Ecuaciones de primer y segundo grado', 'Sistemas de ecuaciones', 'Sucesiones y progresiones'],
 'Medida': ['Medidas indirectas'],
 'Geometría': ['Lugares geométricos', 'Movimientos en el plano', 'Áreas y volúmenes', 'La esfera y coordenadas geográficas'],
 'Funciones': ['Características de las funciones', 'Funciones lineales y afines', 'Funciones cuadráticas'],
 'Probabilidad': ['Probabilidad compuesta', 'Tablas de contingencia'],
 'Estadística': ['Población y muestra', 'Parámetros estadísticos', 'Diagramas de caja'],
 'Pensamiento computacional': ['Algoritmos y programación'],
})
C('4E', 'Matemáticas A', {
 'Números y cálculo': ['Números reales e intervalos', 'Potencias y radicales', 'Porcentajes e interés simple', 'Interés compuesto'],
 'Álgebra': ['Polinomios y factorización', 'Ecuaciones', 'Sistemas de ecuaciones', 'Inecuaciones'],
 'Medida': ['Escalas y unidades'],
 'Geometría': ['Semejanza', 'Áreas y volúmenes de cuerpos'],
 'Funciones': ['Funciones y gráficas', 'Funciones lineales', 'Funciones cuadráticas', 'Funciones de proporcionalidad inversa'],
 'Probabilidad': ['Probabilidad y sucesos', 'Probabilidad en la vida real'],
 'Estadística': ['Estadística unidimensional', 'Interpretar datos y gráficos'],
 'Pensamiento computacional': ['Algoritmos y hojas de cálculo'],
})
C('4E', 'Matemáticas B', {
 'Números y cálculo': ['Números reales e intervalos', 'Radicales', 'Logaritmos'],
 'Álgebra': ['Polinomios y fracciones algebraicas', 'Ecuaciones', 'Sistemas', 'Inecuaciones'],
 'Medida': ['Escalas y unidades'],
 'Geometría': ['Trigonometría', 'Geometría analítica: vectores y rectas', 'Áreas y volúmenes'],
 'Funciones': ['Funciones: dominio y recorrido', 'Funciones polinómicas', 'Funciones exponenciales y logarítmicas'],
 'Probabilidad': ['Combinatoria', 'Probabilidad condicionada'],
 'Estadística': ['Estadística bidimensional', 'Correlación y regresión'],
 'Pensamiento computacional': ['Algoritmos y programación'],
})
C('1E', 'Biología y Geología', {
 'Metodología de la ciencia': ['El método científico', 'El laboratorio y sus normas'],
 'Los seres vivos': ['Características de los seres vivos', 'La célula', 'Clasificación de los seres vivos', 'Los animales', 'Las plantas', 'Hongos, protoctistas y bacterias'],
 'La Tierra': ['La Tierra en el universo', 'La atmósfera', 'La hidrosfera', 'La geosfera: minerales y rocas'],
 'Ecología y sostenibilidad': ['Los ecosistemas', 'Relaciones tróficas', 'Problemas ambientales y ODS'],
})
C('3E', 'Biología y Geología', {
 'Metodología de la ciencia': ['Proyecto de investigación'],
 'Los seres vivos': ['Niveles de organización', 'Las células del cuerpo humano'],
 'La salud humana': ['Nutrición y dieta', 'Aparato digestivo', 'Respiración y circulación', 'Excreción', 'Sistema nervioso y endocrino', 'Aparato locomotor', 'Reproducción humana', 'Salud, enfermedad y sistema inmunitario', 'Hábitos saludables y adicciones'],
 'Medio ambiente': ['Problemas ambientales', 'Desarrollo sostenible'],
})
C('4E', 'Biología y Geología', {
 'Proyecto científico': ['Hipótesis y diseño experimental'],
 'La célula': ['Tipos de células', 'Ciclo celular: mitosis y meiosis'],
 'Genética': ['ADN y ARN', 'Mutaciones', 'Leyes de Mendel', 'Herencia humana'],
 'Evolución': ['Origen de la vida', 'Pruebas de la evolución', 'Selección natural'],
 'Ecosistemas': ['Poblaciones y comunidades', 'Ciclos de la materia y flujo de energía', 'Sostenibilidad'],
 'Geología': ['Estructura de la Tierra', 'Tectónica de placas', 'El tiempo geológico'],
})
C('2E', 'Física y Química', {
 'Metodología de la ciencia': ['Magnitudes y unidades', 'Medir y expresar resultados', 'Tablas y gráficas de datos'],
 'La materia': ['Masa, volumen y densidad', 'Estados de la materia', 'Cambios de estado', 'Mezclas y sustancias puras', 'Separación de mezclas', 'Disoluciones y concentración', 'Elementos y tabla periódica', 'Reacciones químicas'],
 'Movimiento y fuerzas': ['Movimiento y velocidad', 'Aceleración', 'Fuerzas y sus efectos', 'La gravedad'],
 'La energía': ['La energía y sus formas', 'Calor y temperatura'],
})
C('3E', 'Física y Química', {
 'Metodología de la ciencia': ['Notación científica y cambio de unidades', 'Errores de medida'],
 'La materia': ['Leyes de los gases', 'Modelo atómico', 'Átomos, iones e isótopos', 'Enlace químico', 'Formulación inorgánica básica', 'Reacciones y ecuaciones químicas', 'Ley de conservación de la masa'],
 'La energía': ['Energía y trabajo', 'Conservación de la energía', 'Corriente eléctrica y ley de Ohm', 'Potencia y consumo eléctrico', 'Fuentes de energía'],
 'Interacciones': ['Fuerzas eléctricas', 'Magnetismo'],
})
C('4E', 'Física y Química', {
 'La materia': ['Configuración electrónica y tabla periódica', 'Enlace y propiedades', 'El mol', 'Cálculos estequiométricos', 'Química del carbono'],
 'Movimiento y fuerzas': ['Movimiento rectilíneo uniforme', 'Movimiento uniformemente acelerado', 'Leyes de Newton', 'Gravitación', 'Presión y fluidos'],
 'La energía': ['Energía mecánica', 'Trabajo y potencia', 'Calor y transferencia de energía', 'Ondas: sonido y luz'],
})
TYD = {
 'Proceso tecnológico': ['Fases del proyecto técnico', 'Dibujo técnico: vistas y escalas'],
 'Materiales y estructuras': ['Materiales y sus propiedades', 'Estructuras y esfuerzos'],
 'Máquinas y electricidad': ['Máquinas simples y mecanismos', 'Circuitos eléctricos', 'Magnitudes eléctricas'],
 'Programación y digitalización': ['Algoritmos y diagramas de flujo', 'Programación por bloques', 'Sistemas de numeración: binario', 'Seguridad y bienestar digital'],
}
C('1E', 'Tecnología y Digitalización', {k: v[:2] if k != 'Programación y digitalización' else v for k, v in TYD.items()})
C('2E', 'Tecnología y Digitalización', {
 'Proceso tecnológico': ['Proyecto técnico y presupuesto', 'Escalas y acotación'],
 'Materiales y estructuras': ['Madera, metales y plásticos'],
 'Máquinas y electricidad': ['Mecanismos de transmisión', 'Ley de Ohm', 'Energía y consumo'],
 'Programación y digitalización': ['Programación con variables y bucles', 'Robótica y sensores', 'Redes e internet'],
})
C('4E', 'Tecnología', {
 'Electrónica y control': ['Componentes electrónicos', 'Sistemas de control y sensores'],
 'Programación y robótica': ['Programación de microcontroladores', 'Robótica'],
 'Neumática e hidráulica': ['Circuitos neumáticos e hidráulicos'],
 'Instalaciones': ['Instalaciones de una vivienda', 'Eficiencia energética'],
})
C('4E', 'Digitalización', {
 'Dispositivos y redes': ['Hardware y sistemas operativos', 'Redes y conexión'],
 'Datos y programación': ['Hojas de cálculo: fórmulas y gráficos', 'Programación'],
 'Ciudadanía digital': ['Seguridad y privacidad', 'Identidad digital y derechos'],
})
