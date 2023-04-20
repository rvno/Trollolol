import { useState } from "react"
import useStore from "./stores/useStore"

export default function Interface() {
  const [active, isActive] = useState(false)
  const start = useStore((state) => state.start)
  const toggleDrive = useStore((state) => state.toggleDrive)
  const useDefault = () => {
    isActive(true)
    // set default mode
    start()
  }

  const useTrain = () => {
    isActive(true)
    // set train mode
    toggleDrive()
  }

  return (
    <div className={`interface ${active ? 'hidden' : null}`}>
        <div className="interface__inner">
          <div className="interface__heading">
            <h1 className="interface__heading__title">Wrong && Wrong</h1>
            <p className="interface__heading__caption">Trollolol</p>
            <div className="interface__actions">
              <button className="interface__action" onClick={() => useDefault()}>Default</button>
              <button className="interface__action" onClick={() => useTrain()}>Train</button>
            </div>
          </div>
        </div>
    </div>
  )
}