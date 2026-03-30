import { getPackageDetails } from "./package-details"
import { PackageDetails } from "@/types/global"

export async function comparePackages(
  a: string,
  b: string
): Promise<PackageDetails[]> {
  const [pkgA, pkgB] = await Promise.all([
    getPackageDetails(a),
    getPackageDetails(b),
  ])

  return [pkgA, pkgB]
}