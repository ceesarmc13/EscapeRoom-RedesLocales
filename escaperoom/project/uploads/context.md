# Escape Room Ciberseguridad — Context Document
> Documento de referencia para el desarrollo de la Fase 2: Web del PC infectado
> **Estado: Fase 2 (web) IMPLEMENTADA** — ver "Implementación realizada" más abajo.

---

## Concepto general

Un escape room presencial de ciberseguridad. El jugador se sienta delante de un PC cuya pantalla muestra esta web: su ordenador ha sido atacado con ransomware y todos sus archivos están cifrados. Para recuperarlos debe completar 3 pruebas externas, cada una de las cuales produce un código que introduce en una **aplicación descifradora** dentro de la web. Al introducir los 3 códigos correctos, los archivos se descifran a la vez y aparece automáticamente en el "escritorio" un archivo que el atacante dejó olvidado, con las credenciales SSH para conectarse a su máquina.

Es una práctica didáctica para la asignatura de **redes locales**, en entorno controlado.

---

## Flujo completo del escape room

```
FASE 1 — Bullet Hell
  Juego de supervivencia 60 segundos
  Estética Matrix: #00FF41, negro, Courier New, matrix rain
  4 fases internas: BOOT → COMPILE → RUNTIME → KERNEL PANIC
  Al ganar → entrega código K3RN3L-P4N1C

FASE 2 — Web del PC infectado  ← IMPLEMENTADA
  Escritorio simulado infectado por ransomware (SH4D0W-CRYPT)
  Intro narrativa: el hacker SH4D0W avisa de la infección + lista los desafíos
  App DESCIFRADOR.exe: el jugador introduce los 3 códigos
  Al meter los 3 → se descifran los archivos + aparece el archivo del atacante

FASE 3 — Conexión SSH
  Con username + IP + contraseña del archivo del atacante
  El jugador se conecta al servidor físico real (gestionado por el equipo)
  Navega el sistema y encuentra el archivo final que cierra el escape room
```

---

## Fase 2 — La web (archivo `PC Infectado.html`)

### Resumen
Un **único archivo HTML**, funciona **offline**, sin dependencias externas. Simula un escritorio de PC infectado por el ransomware ficticio **SH4D0W-CRYPT**, obra del atacante **SH4D0W**.

### Estética final
- **Paleta:** rojo ransomware dominante (`#ff2020`) + verde Matrix secundario (`#00ff41`) sobre negro.
- **Tipografía:** Courier New (monoespaciada).
- **Atmósfera:** scanlines CRT, parpadeo, viñeta, lluvia Matrix de fondo, wallpaper corrupto. Sin emojis decorativos ni degradados de IA.

---

### La historia (narrativa de SH4D0W)

El antagonista es **SH4D0W**, un intruso que se ha colado en la **red local del aula** (`AULA-INFORMATICA-03`) aprovechando una credencial SSH débil. Ha cifrado todos los archivos del equipo y deja un aviso. No quiere dinero: quiere comprobar si la clase es tan buena como cree. Ha partido la clave maestra en **tres pedazos**, cada uno escondido en uno de los desafíos físicos de la sala. Tono arrogante y burlón, apto para clase.

**Intro al iniciar** (secuencia de tecleo, solo historia + desafíos):
1. `SISTEMA COMPROMETIDO` + `MENSAJE ENTRANTE — ORIGEN DESCONOCIDO`.
2. Aparece, con animación de glitch, una **máscara Anonymous roja** (`assets/anonymous.png`) a pantalla completa de fondo.
3. El hacker se presenta y avisa de la infección.
4. Lista los **3 desafíos**: BULLET-HELL → pdf, DESAFÍO ASCII → xlsx, FOTO OCULTA → zip.
5. Explica que hay que meter los 3 códigos en `DESCIFRADOR.exe`.
6. Botón **> ACEPTAR EL RETO** → entra al escritorio.

La intro se puede saltar con `ESC`.

---

### Escritorio infectado
- **Iconos** de los 3 archivos bloqueados (candado rojo), `LEEME_RESCATE.txt`, `DESCIFRADOR.exe` y el archivo del atacante (oculto hasta el clímax).
- **Panel de rescate** (HUD) con voz de SH4D0W, temporizador `47:00` y contador de claves 0/3.
- **Barra de tareas** con reloj real, alarma "AMENAZA ACTIVA" y menú SISTEMA.
- **Pop-ups recurrentes** (intensidad media) con la voz de SH4D0W: burlas, falso antivirus que no puede limpiar, "te estoy viendo", recordatorios, etc. Se espacian a medida que avanzas.

---

### App DESCIFRADOR.exe (núcleo de la interacción)
Se abre sola al entrar (y desde el icono / menú SISTEMA). Es **donde se introducen los códigos** conseguidos en las pruebas externas.
- Tres ranuras, una por archivo, con su desafío asociado.
- Validación por clave: correcta → ranura verde "CLAVE OK"; incorrecta → glitch rojo "ACCESS DENIED"; si metes la clave de otra prueba → aviso ámbar "pertenece a otra prueba".
- **Los archivos NO se descifran hasta tener las 3 claves.** Clicar un archivo bloqueado remite al DESCIFRADOR.
- El botón **DESCIFRAR TODOS LOS ARCHIVOS** solo se activa al 3/3; entonces se descifran todos a la vez con un log de progreso.

---

### Archivos bloqueados (3 en total)

| # | Archivo | Prueba que da el código | Código (hardcodeado) |
|---|---|---|---|
| 1 | `documento_personal.pdf` | Bullet Hell | `K3RN3L-P4N1C` |
| 2 | `proyecto_trabajo.xlsx` | Desafío ASCII | `R00T-4CC355` |
| 3 | `fotos_familia.zip` | Foto con código oculto | `3XF1LTR4T3D` |

Al abrirse (ya descifrados) muestran **contenido falso creíble**: el pdf es un contrato con datos censurados, el xlsx una hoja de presupuesto, el zip una galería de fotos pixeladas. La validación no distingue mayúsculas/minúsculas ni espacios.

---

### Archivo del atacante (clímax)

Al introducir los 3 códigos: se silencian los pop-ups, la pantalla funde a negro, se revela de nuevo la **máscara Anonymous animada** y se escribe la nota final. Narrativa: SH4D0W **olvidó borrar** su propio registro `deploy_shadow.sh`, que expone las credenciales de su servidor (lección de opsec). También aparece el icono `README_DEL_ATACANTE.txt` en el escritorio (reclicable).

Credenciales (placeholders — editar en el objeto `SSH_CONFIG` al inicio del `<script>`):
```
Usuario SSH : [PENDIENTE]
Dirección IP: [PENDIENTE]
Contraseña  : [PENDIENTE]
```

---

### Máscara Anonymous animada
- Imagen: `assets/anonymous.png` (máscara roja Guy Fawkes sobre negro, con scanlines).
- Aparece con **glitch de revelado** y se anima de forma continua: respiración (escala), parpadeo de brillo, scanlines en movimiento, cortes de glitch y resplandor rojo.
- Se usa en la **intro** (fondo a pantalla completa) y en el **clímax** (sobre la nota final).

---

### Sonido
WebAudio generado por JS (sin archivos externos), puntual: acierto, error, tecleo, revelado de la máscara y secuencia de clímax. Silenciable desde el menú SISTEMA.

---

## Lógica de validación

- **Frontend only** — sin backend, sin base de datos.
- Los 3 códigos están **hardcodeados** (objeto `CODES` / `FILES` en el `<script>`).
- Los códigos se validan **independientemente** y en **cualquier orden** dentro del DESCIFRADOR.
- El descifrado real ocurre **solo** cuando las 3 claves son correctas (trigger automático del clímax).
- Funciona **offline** (archivo HTML local).
- **Persistencia:** el progreso (claves válidas, archivos descifrados, silencio) se guarda en `localStorage`; un refresco no lo pierde.

---

## Controles para el organizador

- **Reiniciar el escape** (re-bloquea los 3 archivos): menú SISTEMA → "REINICIAR ESCAPE", o `Ctrl + Alt + R`.
- **Silenciar sonido:** menú SISTEMA → "Silenciar sonido".
- **Saltar intro:** `ESC`.

---

## Estado actual de los assets

| Elemento | Estado |
|---|---|
| Bullet hell (`Juego Bullet-hell-dificil.html`) | ✅ Hecho — código `K3RN3L-P4N1C` pendiente de hardcodear |
| Desafío ASCII | ✅ Hecho — código `R00T-4CC355` pendiente de hardcodear |
| Foto con código oculto | 🔄 En proceso — código `3XF1LTR4T3D` pendiente de hardcodear |
| **Web PC infectado (`PC Infectado.html`)** | ✅ **Hecho** — falta rellenar `SSH_CONFIG` |
| Servidor SSH físico | ❌ Por definir (Raspberry Pi / portátil Linux) |

---

## Decisiones técnicas cerradas

- Validación: **frontend only**, hardcodeado.
- Códigos: **fijos**, definidos en este documento.
- SSH: gestionado **manualmente** por el equipo organizador.
- La web es un **único archivo HTML** que funciona offline (vanilla JS, sin frameworks).

---

## Pendientes críticos

- **Rellenar `SSH_CONFIG`** (usuario, IP, contraseña) en `PC Infectado.html` cuando el servidor esté definido.
- Hardcodear `K3RN3L-P4N1C` en el bullet hell.
- Hardcodear `R00T-4CC355` en el desafío ASCII.
- Hardcodear `3XF1LTR4T3D` en la foto cuando esté lista.
- Definir nivel técnico de los jugadores en Linux para la Fase 3.

---

## Notas de diseño (cumplidas en la implementación)

- La web es la **pantalla de inicio** — el jugador la ve nada más sentarse.
- Comunica de inmediato que "algo ha ido muy mal" (intro + escritorio infectado).
- Los archivos bloqueados se ven como iconos con candado visible.
- El feedback correcto/incorrecto es **temático** (DECRYPTING / ACCESS DENIED), no un simple "OK".
- La aparición del archivo del atacante es el **clímax dramático** de la fase (negro + máscara + nota).
- **Sonido** ambiente puntual incluido (silenciable).
