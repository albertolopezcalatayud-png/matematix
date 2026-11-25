# Matematix curriculum map v2: course -> subject -> block -> lessons, each lesson tagged with the saber ids it covers.
# Saber ids come from the checklists (see ids.py): PM/PC Primaria Mates/Medio, EM ESO Mates, BG, FQ, TD, TC (Tecnología 4.º), DG (Digitalización 4.º).
MAP = {}
def C(course, subject, blocks):
    out = {}
    for b, lines in blocks.items():
        ls = []
        for line in lines.strip().split('\n'):
            t, _, ids = line.strip().partition(' @')
            ls.append((t.strip(), [i.strip() for i in ids.split(',') if i.strip()]))
        out[b] = ls
    MAP.setdefault(course, {})[subject] = out

NUM, MED, GEO, EST, ALG = 'Números y operaciones', 'Medida', 'Geometría', 'Estadística y probabilidad', 'Álgebra y pensamiento computacional'

# ---------------- PRIMARIA · MATEMÁTICAS ----------------
C('1P', 'Matemáticas', {
NUM: '''Contar hasta 20 @PM1
La decena @PM2
Números hasta 99: decenas y unidades @PM4
Mayor, menor e igual @PM6,PM12
Anterior y posterior @PM6
Pares e impares @PM3
Descomponer números @PM3
Sumar hasta 20 @PM9,PM15
Restar hasta 20 @PM9,PM15
Problemas de juntar y quitar @PM9,PM25''',
MED: '''Medir con palmos y pasos @PM26
Largo y corto, alto y bajo @PM27,PM29
Pesa más, pesa menos @PM27,PM29
Lleno y vacío @PM27,PM29
Días de la semana y meses @PM29,PM30
Las horas en punto @PM29,PM30''',
GEO: '''Dentro, fuera, encima, debajo @PM31
Derecha e izquierda @PM31
Líneas rectas y curvas @PM35
Figuras planas: lados y vértices @PM33
Componer figuras con piezas @PM37,PM46''',
EST: '''¿Seguro, posible o imposible? @PM47,PM48
Preguntar y contar @PM55,PM56
Leer pictogramas @PM58,PM59''',
ALG: '''Series y patrones @PM64
Instrucciones paso a paso @PM64
¿Qué número falta? @PM69,PM12
Juegos de estrategia @PM68''',
})
C('2P', 'Matemáticas', {
NUM: '''Las centenas: números hasta 999 @PM4
Comparar y ordenar hasta 999 @PM6
Sumar llevando @PM9,PM15
Restar llevando @PM9,PM15
Dobles y mitades @PM10
Multiplicar es sumar veces iguales @PM10
Repartir en partes iguales @PM10
Cálculo mental: sumar y restar 10 y 100 @PM15
Problemas de dos pasos @PM9,PM25''',
MED: '''Estimar medidas @PM27
El metro y el centímetro @PM29,PM30
El kilo y el litro @PM29,PM30
El reloj: en punto y media @PM29,PM30
Euros y céntimos @PM25,PM30''',
GEO: '''Polígonos @PM33
La circunferencia y el círculo @PM39
Recorridos en una cuadrícula @PM31
Componer y descomponer figuras @PM37,PM46
Rectas y curvas en objetos @PM35''',
EST: '''¿Qué es más probable? @PM48,PM47
Tablas de recuento @PM56,PM55
Diagramas de barras @PM57,PM59''',
ALG: '''Patrones con números @PM64
Algoritmos: órdenes para moverse @PM64
Igualdades con huecos @PM12,PM69
Juegos de estrategia @PM68''',
})
C('3P', 'Matemáticas', {
NUM: '''Números hasta 9 999 @PM5,PM4
Comparar y ordenar en la recta @PM6,PM20
Redondear y estimar @PM15
Sumas y restas con números grandes @PM9
Las tablas de multiplicar @PM11
Multiplicar por una cifra @PM11
Propiedades: orden y agrupación @PM14
La división: repartir @PM11
Dividir por una cifra @PM11
Fracciones: mitad, tercio y cuarto @PM16
Problemas con las cuatro operaciones @PM25,PM12''',
MED: '''Metro, decímetro, centímetro y milímetro @PM29,PM30
Instrumentos de medida @PM28,PM27
Kilo, gramo y litro @PM29,PM30
El reloj: cuartos y minutos @PM29
Dinero: pagar y recibir el cambio @PM25''',
GEO: '''Rectas, curvas, paralelas y perpendiculares @PM36,PM35
Ángulos: recto, agudo y obtuso @PM41
Clasificar triángulos @PM41
Cuadriláteros; figuras cóncavas y convexas @PM33,PM44
El perímetro @PM38
Coordenadas en una cuadrícula @PM32
Circunferencia y círculo: elementos @PM39''',
EST: '''Suceso y suceso elemental @PM47,PM49
Experimentos con dados y monedas @PM53,PM48
Encuestas y tablas de frecuencias @PM55,PM56
Diagramas de barras @PM57,PM59
La moda @PM60''',
ALG: '''Patrones y reglas @PM64,PM65
¿Qué número falta? @PM69
Algoritmos con repeticiones @PM66
Juegos de estrategia @PM68''',
})
C('4P', 'Matemáticas', {
NUM: '''Números hasta 999 999 @PM5
Múltiplos y divisores @PM7
Multiplicar por dos cifras @PM11,PM14
División con resto y su prueba @PM11
Fracciones: numerador y denominador @PM16
Comparar fracciones @PM20
Fracción de una cantidad @PM16,PM25
Décimas y centésimas @PM17
Sumar y restar decimales @PM17
Multiplicar y dividir por 10, 100 y 1 000 @PM19
Cálculo mental y estimación @PM15
Problemas con fracciones y decimales @PM25,PM12''',
MED: '''Unidades de longitud: conversiones @PM30
Masa y capacidad: conversiones @PM29,PM30
Horas, minutos y segundos @PM29
Medir ángulos @PM41,PM28
Área contando cuadrados @PM38,PM29''',
GEO: '''Polígonos regulares @PM33
Componer y descomponer polígonos @PM37
Poliedros: caras, aristas y vértices @PM34
Giros, traslaciones y simetrías @PM42,PM46
Mapas y puntos cardinales @PM32
Posiciones de rectas @PM36''',
EST: '''Espacio muestral @PM50
Comparar probabilidades @PM48,PM53
Recoger datos con una encuesta @PM55,PM56
Gráficos de líneas y de sectores @PM58,PM59
Media, mediana y moda @PM60
El rango @PM61''',
ALG: '''Sucesiones numéricas @PM65,PM64
Valores desconocidos @PM69
Programar con bloques @PM66
Juegos de lógica @PM68''',
})
C('5P', 'Matemáticas', {
NUM: '''Números de más de seis cifras @PM5
Múltiplos, divisores y criterios de divisibilidad @PM7
Números primos y compuestos @PM7
Potencias: cuadrados y cubos @PM13
Fracciones equivalentes @PM22
Comparar y ordenar fracciones @PM20,PM16
Sumar y restar fracciones @PM24
Milésimas @PM17
Redondear decimales @PM18
Multiplicar y dividir decimales @PM17
Multiplicar y dividir por 10, 100 y 1 000 @PM19
Propiedades y orden de las operaciones @PM14,PM12,PM11
Cálculo mental y estimación @PM15''',
MED: '''Sistema métrico decimal @PM29,PM30
Superficie: m², dm² y cm² @PM29,PM38
Elegir el instrumento de medida @PM28
Medida del tiempo @PM29''',
GEO: '''Medir ángulos con el transportador @PM41
Área del rectángulo y del triángulo @PM38
Coordenadas cartesianas @PM32
Posiciones de rectas en el plano @PM36
Poliedros regulares @PM34
Desarrollos de prismas y pirámides @PM45
Figuras semejantes @PM43
Componer figuras con geometría dinámica @PM37,PM46,PM33
Circunferencia y círculo @PM39
Figuras cóncavas y convexas @PM44''',
EST: '''Azar o no azar @PM47
Sucesos y espacio muestral @PM49,PM50
La probabilidad como medida @PM52
Experimentar para estimar @PM53
Encuestas y recuento @PM55,PM56
Diagramas de sectores @PM58,PM59
Media, moda y mediana @PM60
El rango @PM61''',
ALG: '''Sucesiones y patrones @PM65
Valores desconocidos @PM69,PM12
Crear algoritmos @PM66
Programar con bloques y hoja de cálculo @PM67
Juegos de estrategia @PM68''',
})
C('6P', 'Matemáticas', {
NUM: '''Números negativos @PM8
Potencias de 10 @PM13
Mínimo común múltiplo y máximo común divisor @PM7
Fracciones, decimales y porcentajes @PM21
Porcentajes y descuentos @PM21,PM25
Proporcionalidad directa @PM23
Regla de tres @PM23
Operaciones con fracciones @PM24,PM16,PM22
Operaciones con decimales @PM17,PM18,PM19
Problemas de varias operaciones @PM11,PM14,PM12,PM25''',
MED: '''Conversiones de unidades @PM30
Volumen y capacidad @PM29
Problemas de tiempo @PM29
Medir con precisión @PM28''',
GEO: '''Área de polígonos @PM38,PM37
El número π y la longitud de la circunferencia @PM40,PM39
Área del círculo @PM40
Escalas y planos @PM43,PM32
Transformaciones geométricas @PM42,PM46
Poliedros y cuerpos redondos @PM34,PM33''',
EST: '''Regla de Laplace @PM54,PM52
Tablas de contingencia y diagramas de árbol @PM51,PM50
Población y muestra @PM62
Variables continuas e histogramas @PM63
Media, mediana, moda y rango @PM60,PM61
Interpretar gráficos @PM59,PM58''',
ALG: '''Sucesiones @PM65
Ecuaciones sencillas: el valor desconocido @PM69
Algoritmos y diagramas de flujo @PM66
Hoja de cálculo @PM67
Juegos de estrategia @PM68''',
})

# ---------------- PRIMARIA · CONOCIMIENTO DEL MEDIO (ciencias y tecnología) ----------------
SV, CU, MA, TE, TI, CI = 'Seres vivos y ecología', 'Cuerpo humano y salud', 'Materia, fuerzas y energía', 'Tecnología y digitalización', 'La Tierra y el clima', 'Cultura científica y consumo'
C('1P', 'Conocimiento del Medio', {
SV: '''Seres vivos y objetos inertes @PC1
Plantas y animales @PC2
Cuidar plantas y animales @PC9''',
CU: '''Partes del cuerpo @PC24
Los cinco sentidos @PC24
Hábitos saludables @PC25
Las emociones @PC33''',
MA: '''Materiales y para qué sirven @PC34
La luz y el sonido @PC37''',
TE: '''Usar objetos con seguridad @PC41,PC61
Programar sin pantalla @PC64,PC58''',
TI: '''El agua y sus estados @PC75
Las estaciones @PC68''',
CI: '''Pequeños científicos: observar y preguntar @PC19''',
})
C('2P', 'Conocimiento del Medio', {
SV: '''¿Dónde viven? El hábitat @PC3
Respetar los espacios naturales @PC9''',
CU: '''Enfermedades comunes y cómo evitarlas @PC26
Comer bien y descansar @PC25''',
MA: '''Materiales: propiedades y usos @PC34''',
TE: '''Construir estructuras @PC41
La tecnología en casa y comunicarse bien @PC46
Diseñar una solución @PC57,PC58,PC61
Programar un robot sencillo @PC64''',
TI: '''Planos y mapas sencillos @PC66
La Tierra en los mapas @PC72,PC66
El tiempo atmosférico: medir y anotar @PC68
El cambio climático @PC69
Ahorrar agua @PC76''',
CI: '''La cesta de la compra @PC13
Hacer predicciones y comprobarlas @PC19
Científicas y científicos @PC21''',
})
C('3P', 'Conocimiento del Medio', {
SV: '''Los grandes reinos @PC4
Las plantas: nutrición, relación y reproducción @PC5
Los animales: vertebrados e invertebrados @PC6
Los ecosistemas @PC10,PC9''',
CU: '''Esqueleto, músculos y articulaciones @PC27
Alimentación variada e higiene @PC29
Las emociones @PC33''',
MA: '''Propiedades de los materiales @PC35''',
TE: '''Máquinas simples @PC42
Programar con bloques @PC65,PC64,PC59
Correo y chat seguros @PC47,PC53''',
TI: '''Representar el territorio: mapas @PC67
El relieve @PC77
El agua es de todos @PC76''',
CI: '''Experimentos guiados @PC20
Profesiones científicas @PC21''',
})
C('4P', 'Conocimiento del Medio', {
SV: '''Paisaje y acción humana @PC11''',
CU: '''Los órganos y sus funciones @PC28''',
MA: '''Tipos de energía: sonido, luz y calor @PC38
La electricidad @PC38''',
TE: '''Grandes inventos @PC43
Ciencia y tecnología para la sostenibilidad @PC44
Buscar información de forma segura @PC48,PC55
Resolver problemas técnicos sencillos @PC50
Bienestar digital @PC51
Proyecto de diseño con dispositivos @PC57,PC58,PC61,PC62,PC59''',
TI: '''Los factores del clima @PC70
El Sistema Solar @PC73
La Tierra: forma y movimientos @PC72''',
CI: '''Consumo responsable @PC14
La huella ecológica @PC15
Reducir, reutilizar y reciclar @PC16
Cuidar el medio entre todos @PC17''',
})
C('5P', 'Conocimiento del Medio', {
SV: '''La célula @PC7
La cadena alimentaria @PC8
Ecosistemas en equilibrio @PC10,PC9
Extinción de especies @PC12''',
CU: '''Sistemas y aparatos del cuerpo @PC30
Hábitos de salud y nutrición @PC31
Las emociones @PC33''',
MA: '''Masa, volumen y densidad @PC36
Fuerzas y movimiento @PC39''',
TE: '''Correo, foros y netiqueta @PC47
Contraseñas, spam y phishing @PC53,PC54
Buscar y guardar información @PC48,PC55
Programar con bloques @PC65,PC64,PC59
Problemas técnicos @PC50''',
TI: '''El Universo @PC74
El Sistema Solar @PC73,PC72
Representar el territorio @PC67''',
CI: '''Experimentar y comunicar resultados @PC20,PC21''',
})
C('6P', 'Conocimiento del Medio', {
SV: '''Desarrollo sostenible @PC11,PC18,PC44''',
CU: '''Aparato reproductor y pubertad @PC32''',
MA: '''Transformación de la energía @PC40
Energías renovables y no renovables @PC40''',
TE: '''Instrumentos de medida y máquinas @PC45
Presentaciones y vídeos @PC49
Bienestar digital y ciberacoso @PC51
Huella digital y propiedad intelectual @PC52
Recoger y representar datos @PC56
Patrones y lógica: sí o no @PC60
Proyecto: sensores y motores @PC63,PC62,PC57,PC58,PC61''',
TI: '''Los climas y el cambio climático @PC71
El relieve de Europa @PC78
Uso responsable del agua @PC76''',
CI: '''Derechos del consumidor ecológico @PC22
Publicidad y etiquetas @PC23''',
})

# ---------------- ESO · MATEMÁTICAS ----------------
NE, AE, ME, GE, FE, PE, SE, CE = 'Números', 'Álgebra', 'Medida', 'Geometría', 'Funciones', 'Probabilidad', 'Estadística', 'Pensamiento computacional'
C('1E', 'Matemáticas', {
NE: '''Naturales y enteros: leer, ordenar, comparar @EM1
Valor absoluto @EM5
Criterios de divisibilidad @EM3
Factorizar; mcm y mcd @EM15
Operaciones con enteros @EM13,EM16
Fracciones: representar y comparar @EM2,EM11
Fracciones y decimales @EM6,EM17
Potencias de números naturales @EM19
Proporcionalidad y porcentajes @EM21
Cálculo mental y estimación @EM25,EM18''',
AE: '''Del lenguaje común al algebraico @EM27
Monomios @EM28
Expresiones equivalentes @EM33
Ecuaciones de primer grado @EM32''',
ME: '''Unidades y estimación @EM39,EM42
Medir con la estrategia adecuada @EM40,EM43''',
GE: '''Ángulos en grados y minutos @EM48
Clasificar figuras planas @EM45
Perímetros y áreas @EM44,EM61
Circunferencia, círculo, arcos y sectores @EM53
Construir figuras con geometría dinámica @EM59''',
FE: '''Variables y relaciones @EM62
Coordenadas y gráficas @EM63,EM67''',
PE: '''Suceso seguro, imposible y contrario @EM75
Espacio muestral @EM69
Probabilidad por experimentación @EM74''',
SE: '''Variables estadísticas @EM84
Tablas de frecuencias y gráficos @EM86
Media, mediana y moda @EM88''',
CE: '''Instrucciones y patrones @EM97,EM98
Juegos de lógica @EM100''',
})
C('2E', 'Matemáticas', {
NE: '''Números racionales: operaciones @EM13,EM2
Fracción irreducible y decimales periódicos @EM6,EM17
Potencias de exponente entero @EM9,EM19
Raíces y radicales sencillos @EM9
Notación científica @EM8
Racionales en la recta @EM11
Proporcionalidad y porcentajes @EM21
Prioridad de operaciones @EM16,EM18
Cálculo mental @EM25''',
AE: '''Patrones y generalización @EM27
Operar con monomios y binomios @EM28
Ecuaciones de primer grado @EM32,EM33
Ecuaciones de segundo grado @EM32
Sistemas de ecuaciones @EM35''',
ME: '''Conversiones y escalas @EM42,EM39
Medir con la estrategia adecuada @EM43,EM40''',
GE: '''Teorema de Pitágoras @EM51
Semejanza y escalas @EM46
Prismas, pirámides, cilindros y conos @EM54
Geometría en la vida real @EM61,EM59''',
FE: '''Funciones lineales @EM63
Interpretar gráficas @EM62,EM67''',
PE: '''Espacio muestral @EM69
Contar casos @EM80
Regla de Laplace @EM71''',
SE: '''Población y muestra @EM85,EM90
Gráficos con y sin ordenador @EM86,EM84
Medidas de centralización @EM88''',
CE: '''Algoritmos @EM97,EM98
Juegos de lógica @EM100''',
})
C('3E', 'Matemáticas', {
NE: '''Racionales y valor absoluto @EM2,EM5,EM13
Decimales periódicos a fracción @EM6,EM17
Irracionales y números reales @EM4,EM7
Recta real e intervalos @EM12
Potencias de exponente fraccionario @EM10,EM19,EM20
Operar con irracionales @EM14
Notación científica @EM8
Simplificar expresiones numéricas @EM16,EM18,EM25
Porcentajes: aumentos y disminuciones @EM21,EM22
Interés simple @EM23''',
AE: '''Sucesiones @EM96,EM27
Identidades notables @EM29,EM33
Polinomios: suma, resta y producto @EM30
Ecuaciones de primer y segundo grado @EM32
Sistemas y su interpretación gráfica @EM36''',
ME: '''Precisión y error @EM41,EM39,EM43
Unidades y escalas @EM42''',
GE: '''Áreas de figuras planas @EM44,EM53
Teorema de Tales y semejanza @EM46,EM47
Ángulos en radianes @EM49
Movimientos en el plano @EM50
Pitágoras en problemas @EM51,EM61
Elementos notables del triángulo @EM52,EM59
Áreas y volúmenes de cuerpos @EM55''',
FE: '''Variables y funciones @EM62,EM66
La recta: pendiente y cortes @EM63,EM65
Funciones no lineales @EM64,EM67''',
PE: '''Espacio muestral @EM69
Experimentos compuestos: tablas y árboles @EM70,EM72
Regla de la suma y del producto @EM81
Sucesos compatibles e incompatibles @EM76
Ley de los grandes números @EM73
Riesgo y decisiones @EM83''',
SE: '''Variables y muestreo @EM84,EM85,EM90
Tablas y gráficos con hoja de cálculo @EM87
Medidas de centralización @EM88
Medidas de dispersión @EM89''',
CE: '''Diseñar y programar algoritmos @EM97,EM98,EM99
Juegos de lógica @EM100''',
})
C('4E', 'Matemáticas A', {
NE: '''Números reales @EM4,EM7,EM12
Potencias y radicales @EM10,EM14,EM20
Notación científica @EM8
Operaciones combinadas @EM16,EM17,EM18,EM25
Porcentajes en la vida real @EM21,EM22
Interés simple @EM23''',
AE: '''Sucesiones @EM96,EM27
Polinomios e identidades notables @EM29,EM30,EM33
Valor numérico y raíces @EM31
Factorizar polinomios @EM37
Sistemas de ecuaciones @EM36
Inecuaciones @EM34''',
ME: '''Error, unidades y escalas @EM41,EM42,EM43''',
GE: '''Ángulos y radianes @EM49
Movimientos en el plano @EM50
Pitágoras y el triángulo @EM51,EM52
Razones trigonométricas @EM60
Áreas y volúmenes @EM55
Esfera y coordenadas geográficas @EM56
Vectores y rectas @EM57,EM58
Geometría en la vida real @EM59,EM61''',
FE: '''Variables y funciones @EM62,EM66
Funciones lineales @EM63
Funciones no lineales @EM64,EM67
Modelizar con funciones @EM68''',
PE: '''Espacio muestral @EM69
Experimentos compuestos @EM70,EM72,EM81
Operaciones con sucesos @EM76,EM77,EM78
Probabilidad condicionada @EM79
Ley de los grandes números @EM73''',
SE: '''Diseñar un estudio estadístico @EM84,EM85
Tablas y gráficos con hoja de cálculo @EM87
Medidas de dispersión @EM89
Interpretar estudios estadísticos @EM95''',
CE: '''Algoritmos @EM97,EM98,EM99
Juegos de lógica @EM100''',
})
C('4E', 'Matemáticas B', {
NE: '''Reales e intervalos @EM7,EM12
Potencias y radicales @EM10,EM14,EM20
Notación científica @EM8
Operaciones combinadas @EM16,EM17,EM18,EM25
Porcentajes @EM21,EM22
Interés compuesto @EM24
Logaritmos @EM26''',
AE: '''Sucesiones @EM96,EM27
Polinomios e identidades notables @EM29,EM30,EM33
Valor numérico y raíces @EM31
Factorizar polinomios @EM37
Fracciones algebraicas @EM38
Sistemas de ecuaciones @EM36
Inecuaciones @EM34''',
ME: '''Precisión y error @EM41,EM43''',
GE: '''Ángulos y radianes @EM49
Movimientos en el plano @EM50
Pitágoras y el triángulo @EM51,EM52
Trigonometría @EM60
Esfera y coordenadas geográficas @EM56
Vectores @EM57
Ecuaciones de la recta @EM58
Geometría en contexto @EM59,EM61''',
FE: '''Funciones lineales @EM63
Funciones no lineales y propiedades @EM64,EM66,EM67
Modelizar con funciones @EM68''',
PE: '''Experimentos compuestos @EM70,EM72,EM81
Combinatoria @EM82
Operaciones con sucesos @EM76,EM77,EM78
Probabilidad condicionada @EM79
Ley de los grandes números @EM73
Riesgo y decisiones @EM83''',
SE: '''Diseñar un estudio estadístico @EM84,EM85
Tablas y gráficos con hoja de cálculo @EM87
Medidas de dispersión @EM89
Comparar distribuciones; coeficiente de variación @EM91,EM94
Diagramas de dispersión y correlación @EM92
Regresión con herramientas digitales @EM93
Interpretar estudios estadísticos @EM95''',
CE: '''Algoritmos @EM97,EM98,EM99
Juegos de lógica @EM100''',
})

# ---------------- ESO · BIOLOGÍA Y GEOLOGÍA ----------------
C('1E', 'Biología y Geología', {
'Proyecto científico': '''Científicas y científicos @BG1,BG3
El método científico @BG4,BG5
El laboratorio y sus normas @BG6
Buscar y comunicar con herramientas digitales @BG2''',
'Los seres vivos': '''¿Qué es un ser vivo? @BG19
La célula @BG20
Nutrición autótrofa y heterótrofa @BG21
Niveles de organización @BG23
Clasificar seres vivos @BG24,BG25,BG26
Dominios y reinos @BG27
Bacterias, hongos y protoctistas @BG22
Grupos de animales y plantas @BG28
Claves dicotómicas @BG31
La biodiversidad @BG29''',
'La Tierra': '''La Tierra en el universo @BG33
Estructura de la Tierra @BG35
Minerales y rocas @BG34
La energía interna de la Tierra @BG36
El modelado del relieve @BG32
Atmósfera e hidrosfera @BG37,BG42
El tiempo geológico @BG38
Recursos y riesgos geológicos @BG39''',
'Ecología y sostenibilidad': '''El ecosistema @BG40
Ciclos de materia y flujo de energía @BG41
Problemas ambientales @BG44
Los ODS @BG45
Proteger el medio ambiente @BG46,BG47''',
})
C('3E', 'Biología y Geología', {
'Proyecto científico': '''Científicas y científicos @BG1,BG3
Proyecto de investigación @BG4,BG5
El laboratorio @BG6
Buscar y comunicar @BG2''',
'Cuerpo humano y salud': '''Niveles de organización del cuerpo @BG7
Las células del cuerpo @BG20
Nutrientes y dieta saludable @BG11
Aparatos de la nutrición @BG12
Función de relación @BG13
Reproducción humana @BG15
Cambios en la adolescencia @BG17
Relaciones y sexualidad responsable @BG18
Enfermedades de los aparatos @BG16
Salud y enfermedad @BG8
Sistema inmunitario y vacunas @BG9
Homeostasis @BG10
Sustancias adictivas @BG14''',
'La Tierra': '''Procesos geológicos externos @BG32
Energía interna @BG36
Atmósfera e hidrosfera @BG37
El suelo y las interacciones @BG43
El tiempo geológico @BG38
Riesgos geológicos @BG39''',
'Ecología y salud': '''Ciclos de materia y energía @BG41
Ecodependencia @BG30
Medio ambiente y salud @BG48
Desigualdad y salud @BG49
Corresponsabilidad ambiental @BG47''',
})
C('4E', 'Biología y Geología', {
'Proyecto científico': '''Hipótesis y diseño experimental @BG50''',
'La célula': '''Tipos de células @BG51
Ciclo celular: mitosis y meiosis @BG51''',
'Genética': '''ADN y ARN @BG52
Mutaciones @BG52
Leyes de Mendel @BG52
Herencia humana @BG52''',
'Evolución': '''Origen de la vida @BG53
Pruebas de la evolución @BG53
Selección natural @BG53''',
'Ecología': '''Adaptaciones @BG54
Poblaciones y comunidades @BG54
Ciclos biogeoquímicos @BG54''',
'Geología': '''Estructura de la geosfera @BG55
Tectónica de placas @BG55
El relieve @BG55''',
})

# ---------------- ESO · FÍSICA Y QUÍMICA ----------------
C('2E', 'Física y Química', {
'Destrezas científicas': '''Magnitudes y unidades @FQ1
Medir volúmenes @FQ2,FQ3,FQ4
Medida, error y gráficas @FQ68
Científicas y científicos @FQ67
Proyecto de investigación @FQ69''',
'La materia': '''Densidad @FQ5,FQ6
Estados de la materia @FQ7,FQ10
Cambios de estado @FQ8,FQ9
Mezclas y disoluciones @FQ15
Sustancias puras @FQ16
Separar mezclas @FQ17
Concentración @FQ24
Solubilidad @FQ25
Sustancias simples y compuestas @FQ18,FQ19,FQ20,FQ26
Dibujar la materia: partículas @FQ23
Elemento, átomo y masa atómica @FQ28,FQ27
La tabla periódica @FQ29,FQ30,FQ33
Los elementos en el universo @FQ31,FQ32''',
'El cambio químico': '''¿Qué es una reacción química? @FQ21,FQ34
Tipos de reacciones @FQ35
Conservación de la masa @FQ36
Velocidad de reacción @FQ37
Combustión @FQ38
Oxidación @FQ39
Ácidos y bases @FQ40
Sustancias importantes @FQ22''',
'Movimiento y fuerzas': '''Sistema de referencia y rapidez @FQ56
Gráficas espacio-tiempo @FQ57
Rapidez y velocidad @FQ58
Aceleración @FQ59
Caída libre @FQ60
Las fuerzas @FQ61
Fuerza y aceleración @FQ62
Fuerzas eléctricas y magnéticas @FQ63''',
})
C('3E', 'Física y Química', {
'Destrezas científicas': '''Científicas y científicos @FQ67
Medida, error y gráficas @FQ68
Proyecto de investigación @FQ69''',
'La materia': '''Los gases y el modelo cinético @FQ11
Leyes de los gases @FQ12
Condensación y licuefacción @FQ13
La atmósfera @FQ14
Modelo atómico de Dalton @FQ41,FQ45
Sustancias y reacciones @FQ42
Leyes ponderales @FQ43
Fórmulas y ecuaciones ajustadas @FQ46
El hidrógeno como energía @FQ44''',
'La energía': '''La energía y sus formas @FQ47
Corriente eléctrica @FQ48
Ley de Ohm @FQ49
Potencia y consumo eléctrico @FQ50
Producir electricidad @FQ51
Calor y temperatura @FQ52
Transmisión del calor @FQ53
Rendimiento de máquinas @FQ54
Uso racional de la energía @FQ55''',
'La interacción': '''Carga eléctrica @FQ64
Ley de Coulomb @FQ65
Magnetismo @FQ66''',
})
C('4E', 'Física y Química', {
'Destrezas científicas': '''Hipótesis y fuentes fiables @FQ70''',
'La materia': '''Modelos atómicos @FQ71
Isótopos e iones @FQ72
Sistema periódico @FQ73
Enlace químico @FQ74
Formulación inorgánica @FQ75''',
'El cambio químico': '''Ajuste de ecuaciones @FQ76
El mol @FQ77
Reacciones exotérmicas y endotérmicas @FQ78
Química del carbono @FQ79
Polímeros y macromoléculas @FQ80''',
'Movimiento y fuerzas': '''Posición y desplazamiento @FQ81
Movimiento rectilíneo uniforme @FQ82
Movimiento acelerado y caída libre @FQ83
Ley de Hooke y equilibrio @FQ84
Leyes de Newton @FQ85
Gravitación @FQ86
Presión y fluidos @FQ87''',
'La energía': '''Trabajo y potencia @FQ88
Energía mecánica @FQ89
Ondas y sonido @FQ90
La luz @FQ91''',
})

# ---------------- ESO · TECNOLOGÍA Y DIGITALIZACIÓN ----------------
C('1E', 'Tecnología y Digitalización', {
'Proceso tecnológico': '''Buscar y filtrar información @TD1
Fases del proyecto técnico @TD3
Diseñar y construir un prototipo @TD4
Dibujo: vistas, perspectiva y bocetos @TD32
Documentar el proyecto @TD29''',
'Materiales y estructuras': '''Materiales y sus propiedades @TD20
Estructuras y esfuerzos @TD22
Herramientas y seguridad @TD19''',
'Máquinas y electricidad': '''Palancas y mecanismos @TD24
Relación de transmisión @TD25
Circuitos eléctricos @TD27''',
'Digitalización': '''Partes del ordenador @TD6
Plataformas de aprendizaje @TD8
Textos, hojas de cálculo y diapositivas @TD30
Hoja de cálculo: fórmulas y gráficos @TD31
Proteger dispositivos y datos @TD9
Identidad y bienestar digital @TD10
Convivir en la red @TD11''',
'Pensamiento computacional': '''Modelar problemas @TD13
Programación por bloques @TD15
Bucles, variables y condiciones @TD16
Robótica e IA en la sociedad @TD18''',
'Tecnología y sociedad': '''Historia de la tecnología y reciclaje @TD34''',
})
C('3E', 'Tecnología y Digitalización', {
'Proceso tecnológico': '''Buscar y filtrar información @TD1
Diseñar y construir un prototipo @TD4
Fabricación digital @TD5
Escalas, acotación y dibujo por ordenador @TD33
Documentar y presentar @TD29''',
'Materiales y estructuras': '''Plásticos @TD21
Apoyos y esfuerzos @TD23
Herramientas y seguridad @TD19''',
'Máquinas y electricidad': '''Relación de transmisión @TD25
Magnitudes eléctricas y ley de Ohm @TD26
Diseñar circuitos @TD27
Electrónica analógica @TD28''',
'Digitalización': '''Sistemas operativos y redes @TD7
Proteger dispositivos y datos @TD9
Convivir en la red @TD11
Software libre y propietario @TD12
Hoja de cálculo: funciones y gráficos @TD31''',
'Pensamiento computacional': '''Modelar problemas @TD13
Algoritmos y diagramas de flujo @TD14
Variables, condiciones y bucles @TD16
Apps, robots y tarjetas controladoras @TD17
Robótica, IA e internet de las cosas @TD18
Introducción a la inteligencia artificial @TD2''',
'Tecnología y sociedad': '''Tecnología e impacto ambiental @TD34
La energía: producción e impacto @TD35''',
})
C('4E', 'Tecnología', {
'Proyectos': '''Gestión de proyectos y ciclo de vida @TC1
Diseño 3D y fabricación @TC1''',
'Electrónica y fluidos': '''Electrónica analógica y digital @TC2
Neumática e hidráulica @TC2''',
'Control y robótica': '''Sensores, actuadores y controladores @TC3
Internet de las cosas e IA @TC3''',
'Instalaciones de la vivienda': '''Instalaciones de una vivienda @TC4
Domótica y ahorro @TC4''',
'Tecnología sostenible': '''Obsolescencia y arquitectura bioclimática @TC5
Transporte eficiente @TC5''',
})
C('4E', 'Digitalización', {
'Dispositivos y redes': '''Información digital y unidades @DG1
Ordenadores, sistemas operativos y redes @DG1''',
'Crear y colaborar': '''Buscar, contrastar y licencias @DG2
Crear contenidos y programar apps @DG2''',
'Seguridad y bienestar': '''Seguridad y privacidad @DG3
Identidad digital y bienestar @DG3''',
'Ciudadanía digital': '''Bulos y noticias falsas @DG4
Administración electrónica y fraudes @DG4
Ética de los datos y la IA @DG4''',
})
