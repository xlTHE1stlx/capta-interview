# 🗓️ Prueba Técnica – Cálculo de Fechas Hábiles en Colombia

API REST desarrollada en **TypeScript** que calcula fechas hábiles en **Colombia**, considerando días festivos nacionales, horarios laborales y conversión entre zonas horarias locales y UTC.

El objetivo de este proyecto es implementar una solución **precisa, eficiente y completamente tipada** que permita sumar días y/o horas hábiles a una fecha determinada, aplicando las reglas de negocio definidas para el entorno colombiano.

---

## 🚀 Características principales

-   🧮 **Cálculo de fechas hábiles** según calendario colombiano.
-   🇨🇴 Considera días festivos nacionales (obtenidos desde [WorkingDays.json](https://content.capta.co/Recruitment/WorkingDays.json)).
-   ⏰ **Horario laboral:** Lunes a viernes, de 8:00 a.m. a 5:00 p.m., con pausa de almuerzo de 12:00 p.m. a 1:00 p.m.
-   🌎 **Soporte de zona horaria:** Conversión automática entre hora local de Colombia (`America/Bogota`) y UTC.
-   🔍 **Validación estricta de parámetros** (`days`, `hours`, `date`) y manejo adecuado de errores.
-   💪 Implementación 100% en **TypeScript**, con tipado explícito en toda la solución.

---

## ⚙️ Endpoints

### `GET /api/

Calcula la fecha hábil resultante a partir de los parámetros proporcionados.

**Parámetros (query string):**

| Parámetro | Tipo                  | Descripción                      |
| --------- | --------------------- | -------------------------------- |
| `days`    | number                | Días hábiles a sumar (opcional)  |
| `hours`   | number                | Horas hábiles a sumar (opcional) |
| `date`    | string (ISO 8601 UTC) | Fecha inicial en UTC (opcional)  |

**Ejemplo de petición:**

```
GET /api/?days=1&hours=4
```

**Ejemplo de respuesta exitosa (200 OK):**

```json
{
	"date": "2025-08-01T14:00:00Z"
}
```

**Ejemplo de error (400 Bad Request):**

```json
{
	"error": "InvalidParameters",
	"message": "Debe especificar al menos uno de los parámetros: days u hours."
}
```

---

## 🧠 Reglas de negocio

-   Si no se proporciona `date`, se toma la **hora actual en Colombia** como punto de partida.
-   Si la fecha inicial cae fuera del horario laboral o en un día no hábil, se ajusta al siguiente instante hábil.
-   Los cálculos siempre se realizan en hora local de Colombia y el resultado se devuelve en **UTC (ISO 8601 con sufijo Z)**.
-   Los festivos definidos en el recurso oficial se excluyen automáticamente del conteo.

---

## 🛠️ Tecnologías utilizadas

-   **Node.js** + **TypeScript**
-   **Express.js** para la API REST
-   **Temporal API / Luxon** para manejo de fechas y zonas horarias
-   **ESLint + Prettier** para estilo y buenas prácticas

---

## ▶️ Ejecución local

1. Clonar el repositorio:

    ```bash
    git clone https://github.com/xlTHE1stlx/capta-interview.git
    cd capta-interview
    ```

2. Instalar dependencias:

    ```bash
    npm install
    ```

3. Ejecutar en modo desarrollo:

    ```bash
    npm run dev
    ```

4. Acceder al endpoint local:

    ```
    http://localhost:3000/api/?date&days&hours
    ```

5. Acceder al endpoint remoto:

    ```
    https://capta-interview.vercel.app/api/
    ```

---

## ☁️ Despliegue

La API puede desplegarse fácilmente en plataformas como:

-   **Vercel**

```
https://capta-interview.vercel.app/api/
```

---

## ✅ Criterios de evaluación

-   Correctitud en la lógica de negocio y cálculos de tiempo.
-   Uso adecuado de la zona horaria de Colombia.
-   Tipado explícito y limpio en todo el código TypeScript.
-   Estructura modular, mantenible y clara.
-   Manejo adecuado de errores y validaciones.

---

## 🤖 Uso de herramientas de IA

El uso de herramientas como **ChatGPT**, **GitHub Copilot** o **Stack Overflow** fue permitido como apoyo en el desarrollo, priorizando la comprensión y justificación técnica de cada decisión implementada.
