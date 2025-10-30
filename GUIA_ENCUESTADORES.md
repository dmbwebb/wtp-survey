# Guía para Encuestadores - App de Encuesta WTP

## ¿Qué es esta encuesta?

Mide la **disposición a pagar** de estudiantes para bloquear apps (TikTok/WhatsApp) por una semana.

- Comienzan con 10 tokens (1 token = 1000 COP)
- Eligen entre: recibir tokens o bloquear la app
- Una elección se selecciona al azar para implementar
- **Tiempo:** 5-10 minutos

---

## Cómo Funciona Online/Offline

### Primera Instalación (requiere internet):
1. Abrir Chrome y visitar: https://dmbwebb.github.io/wtp-survey/
2. **Agregar a pantalla de inicio** cuando aparezca el mensaje

### Después de Instalar:
✅ **Funciona 100% sin internet**
- Los datos se guardan en el teléfono
- Múltiples encuestas offline
- Sincroniza automáticamente cuando hay internet

### 📊 Indicador de Estado (Esquina Superior Derecha)

```
🟢 Online: Sincronizados: 5, Pendientes: 2
🔴 Offline: Sincronizados: 5, Pendientes: 2
```

- **Sincronizados:** En la nube
- **Pendientes:** Esperando internet para subir

---

## Cómo Sincronizar Datos

### 🔄 Sincronización Automática
Se sincroniza automáticamente cuando:
- Se completa una encuesta (si hay internet)
- Se abre la app (si hay internet)
- El teléfono se reconecta a internet

**No necesitan hacer nada.**

### 🔘 Sincronización Manual (Esquina Inferior Izquierda)

Botón **"Sincronizar Ahora (X)"** - (X) = pendientes

**Pasos:**
1. Verificar internet (🟢 verde)
2. Clic en "Sincronizar Ahora"
3. Esperar mensaje: "Sync completed successfully!"
4. Verificar "Pendientes: 0"

**Cuándo usar:**
- Al final del día
- Si hay muchas pendientes (>10)

---

## Exportar Datos como Respaldo

### 💾 Botón "Exportar Datos" (Esquina Inferior Derecha)

**Recomendación:** Exportar diariamente

**Pasos:**
1. Clic en **"Exportar Datos (X)"** - (X) = total de encuestas
2. Se descarga archivo: `wtp-survey-export-[ID]-[fecha].json`
3. **Guardar en Google Drive**

✅ Funciona offline
✅ Tres capas de protección: teléfono + nube + exportación

---

## Flujo de Trabajo Diario

### 🌅 Mañana:
- Cargar teléfonos
- Conectar WiFi y abrir app
- Verificar contador de sincronización

### 📱 Durante Encuestas:
- Funciona offline
- Múltiples encuestas por teléfono
- Clic "Nueva encuesta" después de cada una

### 🌙 Noche:
1. Conectar WiFi
2. Clic **"Sincronizar Ahora"**
3. Clic **"Exportar Datos"** en cada teléfono
4. Subir archivos JSON a Google Drive
5. Verificar "Pendientes: 0"

---

## Proceso de Prueba (REQUERIDO)

### ✅ Checklist por Teléfono:

**⚠️ IMPORTANTE:** Usar IDs únicos para cada prueba:
- **Teléfono 1:** TEST 1, TEST 2
- **Teléfono 2:** TEST 3, TEST 4
- **Teléfono 3:** TEST 5, TEST 6
- **Si repiten prueba:** continuar numeración (TEST 7, TEST 8, etc.)

**Paso 1: Prueba Online**
- [ ] Conectar WiFi e instalar app
- [ ] Completar encuesta con **Participant ID: TEST X** (X = número único)
- [ ] Verificar indicador: "Sincronizados: 1, Pendientes: 0"

**Paso 2: Prueba Offline**
- [ ] Activar modo avión (offline)
- [ ] Completar encuesta con **Participant ID: TEST X+1** (siguiente número)
- [ ] Verificar indicador: "Sincronizados: 1, Pendientes: 1"

**Paso 3: Prueba Sincronización**
- [ ] Desactivar modo avión (online)
- [ ] Esperar 10 segundos o clic "Sincronizar Ahora"
- [ ] Verificar indicador: "Sincronizados: 2, Pendientes: 0"

**Paso 4: Confirmar**
- [ ] Clic "Exportar Datos" → verificar descarga del archivo JSON

**✅ Si todos los pasos funcionan → Teléfono listo para campo**

**Nota:** El investigador verificará en Firebase que los IDs aparecen correctamente sincronizados.

---

## Solución de Problemas

| Problema | Solución |
|----------|----------|
| No sincroniza | Verificar WiFi (🟢), usar "Exportar Datos" |
| App no carga | Conectar internet, refrescar página |
| Perdí progreso | Se guarda automáticamente, refrescar para continuar |

**Idioma:** La app tiene English/Español - botón en esquina superior

---

## Resumen

| Función | ¿Internet? |
|---------|-----------|
| Primera instalación | ✅ Sí |
| Completar encuestas | ❌ No |
| Sincronizar a nube | ✅ Sí |
| Exportar datos | ❌ No |

**Conclusión:** Después de instalar, funciona completamente offline. Sincroniza automáticamente cuando hay internet.
