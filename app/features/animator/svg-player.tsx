export type SvgPlayerProps = {
  svgString: string
}

export function SvgPlayer({ svgString }: SvgPlayerProps) {
  return (
    <div className="w-full flex flex-col gap-4">
      <h3 className="text-lg font-semibold">Animation Configuration (Dummy)</h3>
      <pre className="p-4 bg-zinc-900 text-zinc-100 rounded-lg overflow-x-auto text-xs">
        {JSON.stringify({ svgLength: svgString.length, connected: true }, null, 2)}
      </pre>
    </div>
  )
}
