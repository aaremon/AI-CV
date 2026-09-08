import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: {
        ignored: [
          '**/data/**',
          '**/user.json',
          '**/ATS_scanner.json',
          '**/cv_analyzed.json',
          '**/admin_log.json',
          '**/cover_letter.json',
          '**/linkedin.json',
          '**/cv_versions.json',
          '**/feedback.json',
          '**/notifications.json',
          '**/sessions.json',
          '**/privacy_audit.json',
          '**/*.json.tmp*',
        ],
      },
    },
  };
});
