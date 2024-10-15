import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

import dns from 'dns'

// dns.setDefaultResultOrder('verbatim')

export default defineConfig({
	plugins: [react()],
	base: "/QuickEase-Web/"
});
