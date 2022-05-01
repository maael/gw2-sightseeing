import { ReadyState } from 'react-use-websocket'
import { HiCheckCircle, HiCloudUpload, HiExclamation, HiLogout, HiXCircle } from 'react-icons/hi'
import useLink from '~/components/hooks/useLink'

const connectionIconMap = {
  [ReadyState.CONNECTING]: <HiCloudUpload className="text-yellow-500" />,
  [ReadyState.OPEN]: <HiCheckCircle className="text-green-500" />,
  [ReadyState.CLOSING]: <HiLogout className="text-yellow-500" />,
  [ReadyState.CLOSED]: <HiXCircle className="text-red-600" />,
  [ReadyState.UNINSTANTIATED]: <HiExclamation className="text-gray-500" />,
}

const connectionTitleMap = {
  [ReadyState.CONNECTING]: 'Connecting',
  [ReadyState.OPEN]: 'Connected',
  [ReadyState.CLOSING]: 'Closing',
  [ReadyState.CLOSED]: 'Closed',
  [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
}

export default function ConnectionStatus({ title }: { title?: string }) {
  const { link, readyState } = useLink()
  return (
    <div
      className="text-4xl fixed top-5 right-5 hidden sm:block"
      style={{ cursor: 'help', zIndex: 999 }}
      title={`${connectionTitleMap[readyState]}${title || link ? ` - ${JSON.stringify(title || link)}` : ''}`}
    >
      {connectionIconMap[readyState]}
    </div>
  )
}
