import { AppLayout } from "@/components/app-layout"
import { PageContainer } from "@/components/shared"
import { Link } from "wouter"

export default function NotFoundPage() {
  return (
    <AppLayout>
      <PageContainer>
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <p className="text-6xl font-bold text-muted-foreground/30">404</p>
          <p className="text-lg font-semibold text-foreground mt-4">Page not found</p>
          <p className="text-sm text-muted-foreground mt-2">The page you're looking for doesn't exist.</p>
          <Link href="/" className="mt-6 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:opacity-90 transition-opacity">
            Go to Dashboard
          </Link>
        </div>
      </PageContainer>
    </AppLayout>
  )
}
