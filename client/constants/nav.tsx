export const Links: LinkType[] = [
  { label: "DOCS", href: "/documentation" },
  { label: "LAUNCH APP", href: "https://app.tassium.io" }  // or your app URL
]

export interface LinkType {
  label: string,
  href: string
}