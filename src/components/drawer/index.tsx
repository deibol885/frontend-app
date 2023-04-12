import { useQuery } from '@tanstack/react-query'
import { useRecoilValue } from 'recoil'
import { documentState } from '../chat-output/atoms'
import { useDrawer } from './hooks'
import Loader from '../loader'
import { getDocument } from '../../utils/api'
import { useEffect } from 'react'

function DocumentDrawer(): JSX.Element {
  const { isDrawerOpen, toggleDrawer } = useDrawer()
  const document = useRecoilValue(documentState)

  const { status, data, refetch, fetchStatus } = useQuery({
    queryKey: ['document'],
    queryFn: () => getDocument(document!.id, 5),
    enabled: document !== null,
    staleTime: 300000,
  })

  useEffect(() => {
    if (!document) return

    refetch()
  }, [document])

  if (!document) return <></>

  const positionClass = isDrawerOpen ? 'right-0' : '-right-full'
  const classes = `transition-all absolute inset-y-0 z-20 h-screen w-1/2 bg-base-200 flex flex-col items-center justify-center ${positionClass}`

  return (
    <div className={classes}>
      {(status === 'loading' || fetchStatus === 'fetching') && <Loader />}
      {status === 'success' && fetchStatus === 'idle' && (
        <object
          className="mb-4"
          data={`${Object.values(data)[0]}#page=${document.page}`}
          type="application/pdf"
          width="100%"
          height="100%"
        >
          <p>
            Link <a href={`${Object.values(data)[0]}#page=${document.page}`}>to the PDF!</a>
          </p>
        </object>
      )}
      <button className="btn-outline btn-primary btn mx-auto mb-4 mt-auto" onClick={() => toggleDrawer()}>
        Close
      </button>
    </div>
  )
}

export default DocumentDrawer
