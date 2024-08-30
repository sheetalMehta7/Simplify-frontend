// src/components/SidebarNav.tsx
import React from 'react'
import { MdDashboard, MdCalendarToday } from 'react-icons/md'
import { HiClipboardList } from 'react-icons/hi'
import { RiGitRepositoryCommitsFill } from 'react-icons/ri'
import { BsKanban, BsFillBarChartLineFill, BsClock } from 'react-icons/bs'
import { AiOutlineMail } from 'react-icons/ai'
import { CgLogOut } from 'react-icons/cg'
import { useNavigate } from 'react-router-dom'

interface SidebarNavProps {
  onTabSelect: (tab: string) => void
  onToggle: () => void
  isShrinked: boolean
}

interface NavItemProps {
  icon: React.ReactNode
  label: string
  tab: string
  isShrinked: boolean
  onTabSelect: (tab: string) => void
}

const NavItem: React.FC<NavItemProps> = ({
  icon,
  label,
  tab,
  isShrinked,
  onTabSelect,
}) => (
  <li>
    <button
      onClick={() => onTabSelect(tab)}
      className="flex items-center p-4 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg w-full text-left transition-all duration-200"
    >
      {icon}
      {!isShrinked && (
        <span className="ml-3 text-sm md:text-base">{label}</span>
      )}
    </button>
  </li>
)

const SidebarNav: React.FC<SidebarNavProps> = ({
  onTabSelect,
  onToggle,
  isShrinked,
}) => {
  const navigate = useNavigate()

  const navItems = [
    {
      icon: <MdDashboard className="text-xl" />,
      label: 'Dashboard',
      tab: 'Dashboard',
    },
    {
      icon: <RiGitRepositoryCommitsFill className="text-xl" />,
      label: 'Issues',
      tab: 'Issues',
    },
    { icon: <BsKanban className="text-xl" />, label: 'Boards', tab: 'Boards' },
    {
      icon: <MdCalendarToday className="text-xl" />,
      label: 'Calendar',
      tab: 'Calendar',
    },
    {
      icon: <HiClipboardList className="text-xl" />,
      label: 'Projects',
      tab: 'Projects',
    },
    {
      icon: <BsFillBarChartLineFill className="text-xl" />,
      label: 'Development',
      tab: 'Development',
    },
    {
      icon: <AiOutlineMail className="text-xl" />,
      label: 'Marketing',
      tab: 'Marketing',
    },
    { icon: <BsClock className="text-xl" />, label: 'Sales', tab: 'Sales' },
  ]

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-200 flex flex-col transition-all duration-300 shadow-lg rounded-r-lg ${
        isShrinked ? 'w-14' : 'w-52'
      }`}
    >
      <div className="p-4 flex justify-between items-center border-b border-gray-300 dark:border-gray-700">
        {!isShrinked && (
          <h1 className="text-lg font-bold tracking-wide truncate">Simplify</h1>
        )}
        <button onClick={onToggle} className="text-xl p-2">
          {isShrinked ? '>' : '<'}
        </button>
      </div>
      <nav className="flex-1 space-y-2 scrollbar-hide overflow-y-auto">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <NavItem
              key={item.tab}
              icon={item.icon}
              label={item.label}
              tab={item.tab}
              isShrinked={isShrinked}
              onTabSelect={onTabSelect}
            />
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-300 dark:border-gray-700">
        <button
          className="flex items-center justify-center p-4 hover:bg-gray-200 dark:hover:bg-red-700 rounded-lg w-full transition-all duration-300 text-left"
          onClick={() => navigate('/')}
        >
          <CgLogOut className="text-xl" />
          {!isShrinked && (
            <span className="ml-3 text-sm md:text-base">Log out</span>
          )}
        </button>
      </div>
    </aside>
  )
}

export default SidebarNav
