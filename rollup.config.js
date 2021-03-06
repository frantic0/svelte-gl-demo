import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import glsl from 'rollup-plugin-glsl';
import livereload from 'rollup-plugin-livereload';
import serve from 'rollup-plugin-serve';
import { terser } from 'rollup-plugin-terser';

const production = !process.env.ROLLUP_WATCH;

export default {
	input: 'src/main.js',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'public/bundle.js'
	},
	plugins: [
		{
			// hack during development of @sveltejs/gl
			resolveId(id) {
				if (id === 'svelte' || id.startsWith('svelte/')) {
					return require.resolve(id).replace(/\.js$/, '.mjs');
				}
			}
		},

		glsl({
			include: ['**/*.glsl', '../../../**/*.glsl'],
			compress: false
		}),

		svelte({
			// enable run-time checks when not in production
			dev: !production,
			// we'll extract any component CSS out into
			// a separate file — better for performance
			css: css => {
				css.write('public/bundle.css');
			}
		}),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration —
		// consult the documentation for details:
		// https://github.com/rollup/rollup-plugin-commonjs
		resolve(),
		commonjs(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('public'),
		!production && serve('public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser()
	]
};
