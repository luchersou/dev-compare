import Link from "next/link"

import { StatusPage } from "@/components/shared/status-page"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <StatusPage
      code="404"
      title="Not found"
      description="We couldn't find that page or package. Check the name for typos or search for another one."
    >
      <Button asChild>
        <Link href="/">Back to home</Link>
      </Button>
    </StatusPage>
  )
}
