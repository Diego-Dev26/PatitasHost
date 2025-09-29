export default function BadgeBool({value,si="SI",no="NO"}) {
    if (value)
      return (
        <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">
          {si}
        </span>
      )
    return (
      <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-0.5 text-sm font-medium text-red-800">
        {no}
      </span>
    )
  }
  