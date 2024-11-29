import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: 'localhost', // ค่าเริ่มต้นสำหรับ dev
    port: 5173         // ค่าเริ่มต้นพอร์ต 3000
  }
})
