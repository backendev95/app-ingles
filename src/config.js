// Configuración opcional de Supabase para sincronizar tu progreso entre dispositivos.
// La "anon key" es pública por diseño: la seguridad la da la política RLS de la tabla
// (cada usuario solo puede leer y escribir su propia fila) y tu contraseña.
// Si la dejas vacía, puedes pegarla en la app, en Ajustes.
const SUPABASE_CONFIG = {
  url: "",      // ej. "https://abcdxyz.supabase.co"
  anonKey: ""   // ej. "eyJhbGciOiJIUzI1NiIs..."
};
