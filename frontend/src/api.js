// In local dev: Vite proxies /predict etc. to localhost:8000
// On HF Spaces: frontend is served by FastAPI, same origin, no base URL needed
const API_BASE = import.meta.env.VITE_API_URL || "";

export default API_BASE;