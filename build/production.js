import path from 'path'
import esbuild from 'esbuild'

export async function buildJs(file, output) {
    const now = Date.now()
    try {
        await esbuild.build({
            entryPoints: [file],
            bundle: true,
            outfile: `${output}`,
            minify: true,
            sourcemap: true,
        })
        console.log(`packaged javascript (${Date.now() - now}ms).`)
    } catch (e) {
        console.warn(e)
    }
}

export async function production() {
    console.log('Deploying demo...')
    await buildJs(path.join('docs', 'code.ts'), path.join('docs', 'index.js'))
    console.log('Deploying dist files...')
    await buildJs(path.join('code', 'physics.ts'), path.join('dist', 'physics.js'))
    console.log('Deployment complete.')
    process.exit(0)
}

production()