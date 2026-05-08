import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Code2, Layers, FileCode, Settings, AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Scaffolds',
  description: 'Learn the layered architecture, how to add routes, configure env vars, and extend any scaffold.',
};

const nodeLayers = [
  { layer: 'routes/', role: 'HTTP entry points — map URL + method to a controller. No logic here.' },
  { layer: 'controllers/', role: 'Parse + validate request, call service, shape response.' },
  { layer: 'services/', role: 'Business logic. Pure functions — no HTTP knowledge, no DB calls.' },
  { layer: 'dal/', role: 'Data Access Layer — all DB and external API calls live here.' },
  { layer: 'middlewares/', role: 'Cross-cutting concerns: auth, sanitization, CORS, rate limiting.' },
  { layer: 'exceptions/', role: 'Typed error classes (AppError, NotFoundError, ValidationError, …).' },
  { layer: 'handlers/', role: 'Global error handler — catches everything, returns a JSON envelope.' },
  { layer: 'config/', role: 'Env validation (Zod), Pino logger setup, DB connection.' },
  { layer: 'utils/', role: 'Response envelope helper: { success, data, message }.' },
];

const fastapiLayers = [
  { layer: 'api/v1/routes/', role: 'FastAPI routers — map URL + method to a controller.' },
  { layer: 'controllers/', role: 'Request handling and response shaping.' },
  { layer: 'services/', role: 'Business logic. No HTTP or DB knowledge.' },
  { layer: 'repositories/', role: 'Data access — extends BaseRepository[T].' },
  { layer: 'models/schemas/', role: 'Pydantic request/response schemas.' },
  { layer: 'core/', role: 'Config (pydantic-settings), logging (structlog), custom exceptions.' },
  { layer: 'middleware/', role: 'Request logging with trace ID, global exception handlers.' },
];

const envVarsNode = [
  { key: 'NODE_ENV', default: 'development', description: 'Controls log level and CORS behaviour.' },
  { key: 'PORT', default: '3000', description: 'Port the Fastify server listens on.' },
  { key: 'LOG_LEVEL', default: 'info', description: 'Pino log level (trace | debug | info | warn | error).' },
  { key: 'CORS_ORIGIN', default: '*', description: 'Allowed CORS origin(s). Use a comma-separated list in prod.' },
  { key: 'RATE_LIMIT_MAX', default: '100', description: 'Max requests per window per IP.' },
  { key: 'RATE_LIMIT_WINDOW_MS', default: '60000', description: 'Rate limit window in milliseconds.' },
];

const envVarsFastapi = [
  { key: 'APP_ENV', default: 'development', description: 'Environment name.' },
  { key: 'APP_PORT', default: '8000', description: 'Port uvicorn listens on.' },
  { key: 'LOG_LEVEL', default: 'INFO', description: 'structlog level.' },
  { key: 'CORS_ORIGINS', default: '["*"]', description: 'JSON array of allowed origins.' },
  { key: 'SECRET_KEY', default: '—', description: 'Required. Used for JWT signing.' },
];

export default function ScaffoldsDocPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <Link
        href="/docs"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-600"
      >
        <ArrowLeft className="h-4 w-4" /> Back to docs
      </Link>

      <div className="mb-10">
        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-brand-600">
          <Code2 className="h-4 w-4" />
          Scaffolds
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Scaffold architecture</h1>
        <p className="mt-2 text-gray-500">
          Every scaffold enforces a strict layered architecture so all services in the org look the same.
          This page explains each layer, how to add a new route, and how to configure environment variables.
        </p>
      </div>

      <div className="space-y-12">

        {/* Layered architecture */}
        <section id="architecture">
          <div className="mb-4 flex items-center gap-2">
            <Layers className="h-5 w-5 text-brand-600" />
            <h2 className="text-xl font-semibold text-gray-900">Layered architecture</h2>
          </div>
          <p className="mb-4 text-sm text-gray-500">
            Each request flows strictly downward. Upper layers never import from lower ones.
          </p>
          <div className="mb-6 rounded-xl bg-gray-900 px-6 py-5">
            <pre className="font-mono text-sm leading-relaxed text-green-400">{`Request
  └─ Route          (HTTP mapping)
       └─ Controller  (validation + response shaping)
            └─ Service  (business logic)
                 └─ DAL   (data / external calls)`}</pre>
          </div>

          <div className="space-y-8">
            {/* Node.js layers */}
            <div>
              <p className="mb-3 text-sm font-semibold text-gray-700">Node.js / Fastify — src/</p>
              <div className="overflow-hidden rounded-xl border border-gray-200">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium">Directory</th>
                      <th className="px-4 py-3 text-left font-medium">Responsibility</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {nodeLayers.map(({ layer, role }) => (
                      <tr key={layer} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono text-xs text-brand-700">{layer}</td>
                        <td className="px-4 py-3 text-gray-500">{role}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* FastAPI layers */}
            <div>
              <p className="mb-3 text-sm font-semibold text-gray-700">Python / FastAPI — app/</p>
              <div className="overflow-hidden rounded-xl border border-gray-200">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium">Directory</th>
                      <th className="px-4 py-3 text-left font-medium">Responsibility</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {fastapiLayers.map(({ layer, role }) => (
                      <tr key={layer} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono text-xs text-brand-700">{layer}</td>
                        <td className="px-4 py-3 text-gray-500">{role}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Adding a route */}
        <section id="adding-routes">
          <div className="mb-4 flex items-center gap-2">
            <FileCode className="h-5 w-5 text-brand-600" />
            <h2 className="text-xl font-semibold text-gray-900">Adding a new route</h2>
          </div>
          <p className="mb-6 text-sm text-gray-500">
            Follow the same pattern used by the existing <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs">health</code> route.
            Create one file per layer; keep each layer focused on its single responsibility.
          </p>

          <div className="space-y-6">
            {/* Node.js */}
            <div>
              <p className="mb-2 text-sm font-semibold text-gray-700">Node.js — example: GET /api/v1/users</p>
              <div className="space-y-3">
                <div>
                  <p className="mb-1 text-xs text-gray-400">1. src/routes/user.route.ts</p>
                  <div className="rounded-xl bg-gray-900 px-4 py-3">
                    <pre className="font-mono text-xs text-green-400">{`import { FastifyInstance } from 'fastify';
import { getUsersController } from '../controllers/user.controller';

export async function userRoutes(app: FastifyInstance) {
  app.get('/api/v1/users', getUsersController);
}`}</pre>
                  </div>
                </div>
                <div>
                  <p className="mb-1 text-xs text-gray-400">2. src/controllers/user.controller.ts</p>
                  <div className="rounded-xl bg-gray-900 px-4 py-3">
                    <pre className="font-mono text-xs text-green-400">{`import { FastifyRequest, FastifyReply } from 'fastify';
import { getUsers } from '../services/user.service';
import { ok } from '../utils/response.helper';

export async function getUsersController(_req: FastifyRequest, reply: FastifyReply) {
  const users = await getUsers();
  return reply.send(ok(users));
}`}</pre>
                  </div>
                </div>
                <div>
                  <p className="mb-1 text-xs text-gray-400">3. src/services/user.service.ts</p>
                  <div className="rounded-xl bg-gray-900 px-4 py-3">
                    <pre className="font-mono text-xs text-green-400">{`import { findAllUsers } from '../dal/user.repository';

export async function getUsers() {
  return findAllUsers();
}`}</pre>
                  </div>
                </div>
                <div>
                  <p className="mb-1 text-xs text-gray-400">4. Register in src/routes/index.ts</p>
                  <div className="rounded-xl bg-gray-900 px-4 py-3">
                    <pre className="font-mono text-xs text-green-400">{`import { userRoutes } from './user.route';
app.register(userRoutes);`}</pre>
                  </div>
                </div>
              </div>
            </div>

            {/* FastAPI */}
            <div>
              <p className="mb-2 text-sm font-semibold text-gray-700">FastAPI — example: GET /api/v1/users</p>
              <div className="space-y-3">
                <div>
                  <p className="mb-1 text-xs text-gray-400">1. app/api/v1/routes/user.py</p>
                  <div className="rounded-xl bg-gray-900 px-4 py-3">
                    <pre className="font-mono text-xs text-green-400">{`from fastapi import APIRouter
from app.controllers.user_controller import get_users_controller

router = APIRouter(prefix="/users", tags=["users"])

@router.get("")
async def get_users():
    return await get_users_controller()`}</pre>
                  </div>
                </div>
                <div>
                  <p className="mb-1 text-xs text-gray-400">2. Register in app/main.py</p>
                  <div className="rounded-xl bg-gray-900 px-4 py-3">
                    <pre className="font-mono text-xs text-green-400">{`from app.api.v1.routes.user import router as user_router
app.include_router(user_router, prefix="/api/v1")`}</pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Env vars */}
        <section id="env-vars">
          <div className="mb-4 flex items-center gap-2">
            <Settings className="h-5 w-5 text-brand-600" />
            <h2 className="text-xl font-semibold text-gray-900">Environment variables</h2>
          </div>
          <p className="mb-2 text-sm text-gray-500">
            Copy <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs">.env.example</code> to{' '}
            <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs">.env</code> and fill in the values.
            The app validates all required vars at startup and will refuse to start if any are missing.
          </p>
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
            <span>Never commit <code className="rounded bg-amber-100 px-1 font-mono text-xs">.env</code> to Git. It is already in <code className="rounded bg-amber-100 px-1 font-mono text-xs">.gitignore</code>.</span>
          </div>

          <div className="mt-5 space-y-6">
            <div>
              <p className="mb-3 text-sm font-semibold text-gray-700">Node.js</p>
              <div className="overflow-hidden rounded-xl border border-gray-200">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium">Variable</th>
                      <th className="px-4 py-3 text-left font-medium">Default</th>
                      <th className="px-4 py-3 text-left font-medium">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {envVarsNode.map(({ key, default: def, description }) => (
                      <tr key={key} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono text-xs font-semibold text-brand-700">{key}</td>
                        <td className="px-4 py-3 font-mono text-xs text-gray-500">{def}</td>
                        <td className="px-4 py-3 text-gray-500">{description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <p className="mb-3 text-sm font-semibold text-gray-700">Python / FastAPI</p>
              <div className="overflow-hidden rounded-xl border border-gray-200">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium">Variable</th>
                      <th className="px-4 py-3 text-left font-medium">Default</th>
                      <th className="px-4 py-3 text-left font-medium">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {envVarsFastapi.map(({ key, default: def, description }) => (
                      <tr key={key} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono text-xs font-semibold text-brand-700">{key}</td>
                        <td className="px-4 py-3 font-mono text-xs text-gray-500">{def}</td>
                        <td className="px-4 py-3 text-gray-500">{description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Next */}
        <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-6 py-4">
          <Link href="/docs/getting-started" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-600">
            <ArrowLeft className="h-4 w-4" /> Getting Started
          </Link>
          <Link href="/docs/blueprints" className="flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700">
            Blueprints <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
