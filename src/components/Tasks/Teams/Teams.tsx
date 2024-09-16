import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../../redux/store'
import {
  fetchTeams,
  deleteTeamThunk,
} from '../../../redux/features/teams/teamSlice'
import Loader from '../../Loader'
import CreateTeamModal from '../../Modals/CreateTeamModal'
import EditTeamModal from '../../Modals/EditTeamModal'
import { Button } from 'flowbite-react'
import { MdEdit, MdDelete } from 'react-icons/md'

const Teams: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const teams = useSelector((state: RootState) => state.teams.teams)
  const loading = useSelector((state: RootState) => state.teams.loading)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState<any>(null)

  useEffect(() => {
    dispatch(fetchTeams())
  }, [dispatch])

  const handleCreateTeam = () => {
    setIsCreateModalOpen(true)
  }

  const closeCreateModal = () => {
    setIsCreateModalOpen(false)
  }

  const openEditModal = (team: any) => {
    // Extract members as an array of user ids to pass into the modal
    const teamWithMembers = {
      ...team,
      members: team.members.map((member: any) => member.user.id), // Extract user IDs from members
    }
    setSelectedTeam(teamWithMembers)
    setIsEditModalOpen(true)
  }

  const closeEditModal = () => {
    setIsEditModalOpen(false)
    setSelectedTeam(null)
  }

  const handleDeleteTeam = (teamId: string) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      dispatch(deleteTeamThunk(teamId)) // Dispatch delete action
    }
  }

  return (
    <div className="container mx-auto p-4">
      {loading ? (
        <Loader message="Loading teams..." />
      ) : (
        <>
          {teams.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-gray-500 dark:text-gray-300 mb-4">
                No teams available. You can create a new team to get started.
              </p>
              <Button onClick={handleCreateTeam} color="blue">
                Create Team
              </Button>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Teams</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {teams.map((team) => (
                  <li
                    key={team.id}
                    className="border p-4 rounded-md shadow-md bg-white dark:bg-gray-800"
                  >
                    <h3 className="text-lg font-bold">{team.name}</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {team.description || 'No description available'}
                    </p>
                    <div className="flex justify-end mt-4 space-x-2">
                      <Button
                        onClick={() => openEditModal(team)}
                        color="blue"
                        size="xs"
                        className="flex items-center"
                      >
                        <MdEdit className="mr-1" />
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDeleteTeam(team.id)}
                        color="red"
                        size="xs"
                        className="flex items-center"
                      >
                        <MdDelete className="mr-1" />
                        Delete
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      <CreateTeamModal isOpen={isCreateModalOpen} onClose={closeCreateModal} />

      {selectedTeam && (
        <EditTeamModal
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          team={selectedTeam} // Pass the team with extracted member IDs
        />
      )}
    </div>
  )
}

export default Teams
