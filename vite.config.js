const { defineConfig } = require('vite');
const react = require('@vitejs/plugin-react');
module.exports = defineConfig({ plugins: [react()], build: { outDir: 'client/dist', emptyOutDir: true }, server: { proxy: { '/api': 'http://localhost:4000' } } });
