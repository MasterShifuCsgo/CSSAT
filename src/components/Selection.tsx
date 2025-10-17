import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import networking_img from '@/assets/Networking.jpg'
import software_img from '@/assets/Software.jpg'
import cyber_security_img from '@/assets/Cyber_security.jpg'

const Selection = () => {
  const navigate = useNavigate()
  const dropdownRef = useRef<HTMLUListElement | null>(null)

  const card = [
    { label: 'network_security', display: 'Network security', img: networking_img },
    {
      label: 'secure_software_development',
      display: 'Secure software development',
      img: software_img,
    },
    { label: 'cyber_hygiene', display: 'Cyber hygiene', img: cyber_security_img },
  ]

  const taskTypes = [
    { label: 'Drag & Drop', value: 'drag_and_drop' },
    { label: 'Multiple Choice', value: 'multiple_choice' },
    { label: 'Scenario', value: 'scenario' },
  ]

  // dropdown state
  const [dropdown, setDropdown] = useState<{
    visible: boolean
    x: number
    y: number
    domain: string | null
  }>({ visible: false, x: 0, y: 0, domain: null })

  // handle card click
  const handleCardClick = (e: React.MouseEvent, domain: string) => {
    e.stopPropagation()
    setDropdown({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      domain,
    })
  }

  // handle selection
  const handleTaskSelect = (taskType: string) => {
    if (!dropdown.domain) return
    setDropdown({ visible: false, x: 0, y: 0, domain: null })
    navigate(`/task/${dropdown.domain}/${taskType}`)
  }

  // close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdown({ visible: false, x: 0, y: 0, domain: null })
      }
    }

    if (dropdown.visible) {
      document.addEventListener('click', handleClickOutside)
    }
    return () => document.removeEventListener('click', handleClickOutside)
  }, [dropdown.visible])

  return (
    <div className="min-h-screen relative bg-black text-white">
      <div className="flex justify-center w-full py-5">
        <h1 className="text-4xl md:text-5xl font-bold text-white">
          Select one of the options
        </h1>
      </div>

      <div className="flex flex-col lg:flex-row justify-center items-center gap-4 px-4 py-5">
        {card.map(({ label, display, img }) => (
          <div
            key={label}
            onClick={(e) => handleCardClick(e, label)}
            className="w-full lg:flex-1 relative flex justify-center items-center 
                       text-center text-2xl font-bold rounded-lg border border-transparent 
                       text-white hover:opacity-90 cursor-pointer select-none 
                       min-h-[25vh] lg:min-h-[70vh] overflow-hidden"
            style={{
              backgroundImage: `url(${img})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}>
            <span className="relative z-10 bg-black/70 px-4 py-2 rounded max-w-[70%]">
              {display}
            </span>
          </div>
        ))}
      </div>

      {/* dropdown */}
      {dropdown.visible && (
        <ul
          ref={dropdownRef}
          className="fixed bg-gray-900 border border-gray-700 rounded shadow-lg text-white text-sm"
          style={{
            top: dropdown.y,
            left: dropdown.x,
            transform: 'translate(5px, 5px)', // tiny offset so cursor doesn’t cover it
            zIndex: 1000,
          }}
          onClick={(e) => e.stopPropagation()}>
          {taskTypes.map((t) => (
            <li
              key={t.value}
              onClick={() => handleTaskSelect(t.value)}
              className="px-4 py-2 hover:bg-gray-700 cursor-pointer whitespace-nowrap">
              {t.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Selection
