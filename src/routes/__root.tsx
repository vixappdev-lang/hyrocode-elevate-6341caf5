import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" },
      { name: "googlebot", content: "index, follow" },
      { name: "theme-color", content: "#0a0a0a" },
      { title: "HyroCode |  Criação de site e Aplicativos" },
      {
        name: "description",
        content:
          "HYROCODE cria soluções personalizadas, modernas e funcionais para destacar seu negócio online. Transformamos sua ideia em sucesso digital!",
      },
      {
        name: "keywords",
        content:
          "hyrocode, criação de sites, landing page premium, sistema sob medida, dashboard, desenvolvimento web, software sob medida, painel administrativo, criação de site profissional, agência digital brasil",
      },
      { name: "author", content: "HyroCode" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "HyroCode" },
      { property: "og:locale", content: "pt_BR" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "HyroCode |  Criação de site e Aplicativos" },
      { name: "twitter:title", content: "HyroCode |  Criação de site e Aplicativos" },
      { property: "og:description", content: "HyroCode Digital Studio creates premium, high-level websites for brands." },
      { name: "twitter:description", content: "HyroCode Digital Studio creates premium, high-level websites for brands." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/5wz0PRKx06bTGHTlSFcAWZ4xhd12/social-images/social-1779141516270-hyrocode.webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/5wz0PRKx06bTGHTlSFcAWZ4xhd12/social-images/social-1779141516270-hyrocode.webp" },
      { name: "description", content: "HyroCode Digital Studio creates premium, high-level websites for brands." },
    ],
    links: [
      { rel: "icon", type: "image/png", sizes: "512x512", href: "/favicon.png" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon.png" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Inter+Tight:wght@500;600;700&display=swap",
      },
      { rel: "stylesheet", href: appCss },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "HyroCode",
          url: "https://www.hyrocode.online",
          logo: "https://www.hyrocode.online/favicon.png",
          description:
            "HYROCODE cria soluções personalizadas, modernas e funcionais para destacar seu negócio online. Transformamos sua ideia em sucesso digital!",
          sameAs: ["https://instagram.com/hyrocode"],
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer support",
            areaServed: "BR",
            availableLanguage: ["Portuguese"],
          },
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
