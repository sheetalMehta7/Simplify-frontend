import React, { useState, useEffect } from 'react'
import DashboardLayout from '../layout/DashboardLayout'
import DashboardTabs from '../components/Tabs/DashboardTabs'
import TeamsDashboardTabs from '../components/Tabs/TeamsDashboardTabs'
import Calendar from '../components/Calendar/Calendar'
import Loader from '../components/Loader'
import { Outlet } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../redux/store'

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('Dashboard')
  const [loading, setLoading] = useState<boolean>(false)
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => {
      setLoading(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [activeTab])

  const handleTabSelect = async (tab: string) => {
    setActiveTab(tab)
    if (tab === 'TeamsBoard') {
      // Uncomment this if you want to fetch team tasks when the TeamsBoard tab is selected
      // await dispatch(fetchTeamTasks())
    }
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-screen">
          <Loader message="Loading content..." />
        </div>
      )
    }

    switch (activeTab) {
      case 'Dashboard':
        return (
          <>
            <DashboardTabs />
            <div>
              <Outlet />
            </div>
          </>
        )
      case 'TeamsBoard':
        return (
          <>
            {/* Displaying TeamsDashboardTabs */}
            <TeamsDashboardTabs />
          </>
        )
      case 'Calendar':
        return <Calendar />
      case 'Issues':
        return (
          <p className="text-gray-900 dark:text-gray-200">
            Issues content goes here.
          </p>
        )
      case 'Projects':
        return (
          <p className="text-gray-900 dark:text-gray-200">
            Projects content goes here.
          </p>
        )
      case 'Development':
        return (
          <p className="text-gray-900 dark:text-gray-200">
            Development content goes here.
          </p>
        )
      case 'Marketing':
        return (
          <p className="text-gray-900 dark:text-gray-200">
            Marketing content goes here.
          </p>
        )
      default:
        return (
          <p className="text-gray-900 dark:text-gray-200">Content not found.</p>
        )
    }
  }

  return (
    <DashboardLayout onTabSelect={handleTabSelect}>
      <div>{renderContent()}</div>
    </DashboardLayout>
  )
}

export default Dashboard
