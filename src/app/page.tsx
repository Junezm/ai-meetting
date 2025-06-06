"use client"
import { useState } from "react"

export default function Home() {

  const [count, setCount] = useState(0)

  return (
    <div className="text-2xl text-black">
      <h1>Count: {count}</h1>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  )
}