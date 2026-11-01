import Link from "next/link"

import { StatusPage } from "@/components/shared/status-page"

export default function NotFound() {
  return (
    <StatusPage
      code="404"
      title="Not found"
      description="We couldn't find that page or package. Check the name for typos or search for another one."
    >
      <Link href="/" className="key key--primary">
        Back to home
      </Link>
    </StatusPage>
  )
}
