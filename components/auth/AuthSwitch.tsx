import Link from "next/link"

export default function AuthSwitch({
  label,
  linkText,
  linkHref,
}: {
  label: string
  linkText: string
  linkHref: string
}) {
  return (
    <p className="text-sm text-gray-500 mt-6 text-center">
      {label}{" "}
      <Link
        href={linkHref}
        className="text-gray-900 font-medium hover:underline"
      >
        {linkText}
      </Link>
    </p>
  )
}