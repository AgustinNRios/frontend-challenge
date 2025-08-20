# 🎯 SWAG Frontend Challenge

---

## 🚀 Comenzar

```bash
# 1. Clonar el repositorio
git clone [URL_DEL_REPO]
cd swag-challenge

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo
npm run dev

# 4. Abrir en el navegador
# http://localhost:3000
```

---

#### **🐛 PARTE 1: Detección y Corrección de Bugs (40 puntos)**

Encuentra y corrige estos 8 bugs críticos:

<!-- 1. **Bug de Búsqueda:** La búsqueda es case-sensitive y no encuentra productos -->
<!-- 2. **Bug de Ordenamiento:** Falta implementar ordenamiento por precio -->
<!-- 3. **Bug de Estado:** Productos "pending" se muestran como "disponibles" -->
4. **Bug de Stock:** Un producto aparece sin stock cuando debería tener 150 unidades
5. **Bug de Datos:** Faltan 14 productos para llegar al total prometido de 20
<!-- 6. **Bug de Cálculo:** La calculadora de precios no encuentra el mejor descuento por volumen -->
<!-- 7. **Bug de Formato:** Los precios no muestran formato chileno (CLP) -->
<!-- 8. **Bug de Validación:** No hay validación de cantidad máxima en inputs -->

#### **🛠️ PARTE 2: Implementación de Funcionalidades (40 puntos)**

Implementa estas 4 funcionalidades clave:

1. **Carrito de Compras:**
   - Agregar productos al carrito
   - Mostrar contador de items en el header
   - Persistir carrito en localStorage

2. **Filtros Avanzados:**
   - Filtro por proveedor
   - Filtro por rango de precios
   - Limpiar todos los filtros

3. **Simulador de Cotización:**
   - Formulario con datos de empresa
   - Cálculo de precio final con descuentos
   - Generar resumen en formato exportable

4. **Mejoras de UX:**
   - Loading states en la aplicación
   - Animaciones suaves en transiciones
   - Mensajes de error user-friendly

#### **🎨 PARTE 3: Creatividad y Mejoras (20 puntos)**

Sorpréndenos con mejoras que creas importantes:

- **Performance:** Optimizaciones que consideres necesarias
- **Accesibilidad:** Mejoras para usuarios con discapacidades
- **Mobile:** Optimizaciones para dispositivos móviles
- **Funcionalidades extra:** Lo que creas que falta para una mejor experiencia

---
---

## 🎯 Consejos para el Éxito

### **🔍 Pistas para encontrar bugs:**
- Revisa `src/data/products.ts` - hay inconsistencias de datos
- Los filtros en `ProductList.tsx` tienen lógica incorrecta
- La calculadora en `PricingCalculator.tsx` no calcula bien
- Algunos estados de producto no se manejan correctamente

### **💡 Ideas para funcionalidades:**
- El carrito puede ser un contexto de React
- Los filtros pueden usar URL params para compartir links
- Las cotizaciones pueden generar un PDF o enviar email
- Los loading states mejoran mucho la percepción de velocidad

### **⚠️ Lo que NO tienes que hacer:**
- ❌ No cambies la estructura de carpetas principal
- ❌ No instales librerías pesadas innecesarias
- ❌ No reescribas todo desde cero
- ❌ No te preocupes por el backend (usa mocks)

---

## 📤 Cómo Entregar

### **Cuando termines:**

1. **Asegúrate que todo funciona:**
   ```bash
   npm run build
   npm run preview
   ```

2. **Haz push a tu repositorio GitHub**

3. **Despliega en Vercel/Netlify** (recomendado)

4. **Envía tu solución automáticamente:**

   ## 🎯 **[ENVIAR CHALLENGE →](https://swag-challenge-form.vercel.app)**

   ⚠️ **IMPORTANTE:** Usa el formulario oficial arriba para enviar tu solución.

   **Información requerida:**
   - 🔗 URL de tu repositorio GitHub (fork con tu solución)
   - 🚀 URL de la aplicación desplegada (opcional)
   - 👤 Tu nombre completo
   - 📧 Tu email de contacto

---

## 🏆 Pasos Siguientes

- **Evaluación:** Tu solución será evaluada automáticamente tras el envío
- **Revisión:** Nuestro equipo evaluará tu solución en 24-48 horas
- **Feedback:** Si pasas a la siguiente fase, te contactaremos para una video llamada de 15 minutos
- **Decisión final:** Dentro de 48 horas de la entrega

---

## 🤔 ¿Preguntas?

**NO** puedes hacer preguntas durante el challenge - parte del test es manejar ambigüedad de forma autónoma. Sin embargo, si tienes problemas técnicos para ejecutar el proyecto, puedes escribir a `dev@swag.cl`.


**Flujo del proceso:**
- Envías tu solución.
- Nuestro sistema la evalúa de forma automática y te envía un correo con tu puntaje.
- Si tu puntaje es excepcional, te contactaremos para agendar una entrevista por video.
- Si no eres seleccionado, puedes eliminar tu repositorio una vez que recibas el correo con tu puntaje.
