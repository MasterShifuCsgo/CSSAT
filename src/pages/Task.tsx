import { useParams } from 'react-router-dom'
import TaskRenderer from '@/components/TaskRenderer'

const Start = () => {
  const { domain, taskType } = useParams<{ domain: string; taskType: string }>()

  return (        
    <TaskRenderer domain={domain} taskType={taskType} />           
  )
}

export default Start
