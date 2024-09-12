import React, { useState, useRef } from 'react'
import { MdDashboard, MdCreate, MdCancel } from 'react-icons/md'
import { FaTeamspeak } from 'react-icons/fa'
import { VscSettings } from 'react-icons/vsc'
import { useDispatch, useSelector } from 'react-redux'
import FilterDropdown from './Modals/FilterModal'
import CreateTaskModal from './Modals/CreateTaskModal'
import TaskBoardCommon from './Tasks/TaskBoardCommon'
import { createNewTask } from '../redux/features/tasks/tasksSlice'
import { RootState, AppDispatch } from '../redux/store'
import { Task } from '../redux/features/tasks/tasksSlice'
import { Button } from 'flowbite-react'

interface Tab {
  name: string
  icon: React.ReactNode
}

const TABS: Tab[] = [
  { name: 'My Tasks', icon: <MdDashboard /> },
  { name: 'Team Tasks', icon: <FaTeamspeak /> },
]

const DashboardTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>(TABS[0].name)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false)
  const [filters, setFilters] = useState<{
    date: string
    assignee: string
    status: string
  }>({
    date: '',
    assignee: '',
    status: '',
  })

  const { tasks } = useSelector((state: RootState) => state.tasks)
  const user = useSelector((state: RootState) => state.user.profile)
  const dispatch: AppDispatch = useDispatch()
  const filterButtonRef = useRef<HTMLButtonElement>(null)

  const handleTabClick = (tabName: string) => setActiveTab(tabName)
  const toggleFilter = () => setIsFilterOpen((prev) => !prev)
  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  const applyFilters = (filterValues: {
    date: string
    assignee: string
    status: string
  }) => {
    setFilters(filterValues)
  }

  const clearAllFilters = () => {
    setFilters({ date: '', assignee: '', status: '' })
  }

  const removeFilter = (filterKey: keyof typeof filters) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: '',
    }))
  }

  const handleSaveTask = async (newTask: Partial<Task>) => {
    try {
      await dispatch(createNewTask(newTask)).unwrap()
      closeModal() // Close the modal after successfully saving the task
    } catch (error) {
      console.error('Failed to create task:', error)
    }
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header with Tabs, Filter, and Create Task buttons */}
      <div className="container mx-auto p-4 md:p-5 flex-none">
        <div className="bg-white dark:bg-slate-800 rounded-md shadow-md mb-6 p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <TabButtons
              tabs={TABS}
              activeTab={activeTab}
              onTabClick={handleTabClick}
            />
            <div className="mt-4 md:mt-0 flex space-x-2">
              <FilterButton
                ref={filterButtonRef}
                isFilterOpen={isFilterOpen}
                onClick={toggleFilter}
              />
              <CreateTaskButton onClick={openModal} />
            </div>
          </div>

          {/* Filter Dropdown */}
          {isFilterOpen && (
            <FilterDropdown
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
              filters={filters}
              onApply={applyFilters}
              onClearAll={clearAllFilters}
            />
          )}

          {/* Active Filters as Badges */}
          {Object.values(filters).some((filter) => filter) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {filters.date && (
                <FilterTag
                  label={`Date: ${filters.date}`}
                  onRemove={() => removeFilter('date')}
                />
              )}
              {filters.assignee && (
                <FilterTag
                  label={`Assignee: ${filters.assignee}`}
                  onRemove={() => removeFilter('assignee')}
                />
              )}
              {filters.status && (
                <FilterTag
                  label={`Status: ${filters.status}`}
                  onRemove={() => removeFilter('status')}
                />
              )}
              <Button color="red" onClick={clearAllFilters}>
                Clear All
              </Button>
            </div>
          )}

          {/* Create Task Modal */}
          {user && (
            <CreateTaskModal
              isOpen={isModalOpen}
              onClose={closeModal}
              onSave={handleSaveTask}
              userId={user.id}
              userName={user.name}
            />
          )}
        </div>
      </div>

      {/* Task Board based on active tab and filters */}
      <div className="flex-1 container mx-auto p-4 md:p-5">
        <div className="bg-white dark:bg-slate-800 rounded-md shadow-md p-4 h-full">
          {activeTab === 'My Tasks' && (
            <TaskBoardCommon
              tasks={tasks}
              filters={filters}
              boardType="personal"
            />
          )}
          {activeTab === 'Team Tasks' && (
            <TaskBoardCommon tasks={tasks} filters={filters} boardType="team" />
          )}
        </div>
      </div>
    </div>
  )
}

export default DashboardTabs

// Helper Components

// FilterTag to display active filters as badges
interface FilterTagProps {
  label: string
  onRemove: () => void
}

const FilterTag: React.FC<FilterTagProps> = ({ label, onRemove }) => (
  <div className="inline-flex items-center px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-full m-1">
    <span className="mr-2">{label}</span>
    <button onClick={onRemove} className="text-red-500 hover:text-red-700">
      <MdCancel size={18} />
    </button>
  </div>
)

// FilterButton to toggle the filter dropdown
interface FilterButtonProps {
  isFilterOpen: boolean
  onClick: () => void
}

const FilterButton = React.forwardRef<HTMLButtonElement, FilterButtonProps>(
  ({ isFilterOpen, onClick }, ref) => (
    <button
      ref={ref}
      className={`flex items-center justify-center px-4 py-2 rounded-md transition-all duration-300 border border-gray-100 hover:text-white ${
        isFilterOpen
          ? 'text-white bg-blue-500'
          : 'text-gray-900 dark:text-gray-200 hover:bg-blue-600 dark:hover:bg-blue-500'
      }`}
      onClick={onClick}
    >
      <VscSettings className="h-6 mr-2" />
      {isFilterOpen ? 'Close Filter' : 'Filter'}
    </button>
  ),
)

// CreateTaskButton to open the task creation modal
const CreateTaskButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center justify-center px-4 py-2 text-gray-900 dark:text-gray-200 rounded-md transition-all duration-300 border border-gray-100 hover:text-white hover:bg-blue-600 dark:hover:bg-blue-500"
  >
    <MdCreate className="h-6 mr-2" />
    Create Task
  </button>
)

// TabButtons to switch between different task views
interface TabButtonsProps {
  tabs: Tab[]
  activeTab: string
  onTabClick: (tabName: string) => void
}

const TabButtons: React.FC<TabButtonsProps> = ({
  tabs,
  activeTab,
  onTabClick,
}) => (
  <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
    {tabs.map((tab) => (
      <button
        key={tab.name}
        className={`flex items-center justify-center px-4 py-2 rounded-md transition-all duration-300 border border-gray-100 ${
          tab.name === activeTab
            ? 'text-white bg-blue-500'
            : 'text-gray-900 dark:text-gray-200 hover:text-white hover:bg-blue-600 dark:hover:bg-blue-500'
        }`}
        onClick={() => onTabClick(tab.name)}
      >
        {tab.icon}
        <span className="ml-2">{tab.name}</span>
      </button>
    ))}
  </div>
)
