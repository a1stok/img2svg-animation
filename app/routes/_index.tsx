import type { Route } from "./+types/_index"

export const meta: Route.MetaFunction = () => [
  { title: "Image to SVG Animation" },
  { name: "description", content: "Upload an image and animate it as SVG paths." },
]

export default function Index() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 gap-8">
      <h1 className="text-4xl font-bold tracking-tight">Image to SVG Animation</h1>
      <p className="text-lg opacity-60 max-w-md text-center">
        Upload an image to convert it into animated SVG paths.
      </p>
    </main>
  )
}
