import jsonServer from 'json-server'
import cors from 'cors'
const { create, router: _router, defaults, rewriter } = jsonServer
const server = create()

server.use(cors())
const router = _router('./src/db/db.json')
const middlewares = defaults()

// Utiliser le port fourni par Render ou 3000 par défaut
const port = process.env.PORT || 3000

server.use(middlewares)

// Optionnel : Ajouter des règles de réécriture si nécessaire
server.use(rewriter({
  "/api/*": "/$1"
}))

server.use(router)

server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`)
})
