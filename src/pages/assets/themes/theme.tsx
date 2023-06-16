import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRecoilValue } from 'recoil'
import { useCurrentAsset } from '../hooks'
import { useCurrentTheme } from './hooks'
import { useDocumentModal } from '../../../components/document-modal/hooks'
import { getThemeSummary } from '../../../utils/api'
import { qaState } from '../../../components/themes-toggles/atoms'
import { formatReferences } from '../../../utils/helpers'
import { DocumentLink } from '../../../components/document-modal/types'
import DocumentModal from '../../../components/document-modal'
import Spinner from '../../../components/spinner'
import Icon from '../../../components/icon'
import ThemeChart from '../../../components/theme-chart'
import ThemeMetrics from '../../../components/theme-metrics'

function Theme() {
  const [references, setReferences] = useState<DocumentLink[]>([])
  const currentAsset = useCurrentAsset()
  const theme = useCurrentTheme()
  const QAs = useRecoilValue(qaState)

  const themeQAs = QAs.filter(
    (qa) => qa.assetId === currentAsset!.id && qa.themeId === theme!.id,
  )

  const { onClickDocument } = useDocumentModal()

  const { data, fetchStatus } = useQuery({
    queryKey: ['impact_summary', theme!.id],
    queryFn: () => getThemeSummary(currentAsset!.id, theme!.id),
    staleTime: Infinity,
  })

  useEffect(() => {
    if (!data || !data.references) return

    setReferences(formatReferences(data!.references!))
  }, [data])

  if (fetchStatus === 'fetching') return <Spinner />

  return (
    <>
      <DocumentModal />
      <div className="flex flex-col items-start justify-start gap-2 md:flex-row">
        <div className="flex w-full flex-col gap-2 md:w-1/2">
          <div className="rounded-md bg-base-200 p-4">
            <h1 className="mb-4 text-3xl text-accent">{theme!.name}</h1>
            <p>{data.summary}</p>
            {references.length > 0 ? (
              <>
                <h2 className="mt-4 mb-4 text-2xl">References</h2>
                <ol className="mt-4 list-none pl-2">
                  {references.map((link, index) => (
                    <li
                      className="cursor-pointer"
                      onClick={() => onClickDocument(link)}
                      key={index}
                    >
                      <Icon icon="file-pdf" size={16} />
                      <span className="ml-2 italic text-secondary hover:underline">
                        {link.name}, page {link.page}
                      </span>
                    </li>
                  ))}
                </ol>
              </>
            ) : null}
          </div>
        </div>
        <div className="flex w-full flex-col gap-2 md:w-1/2">
          <ThemeMetrics />
          <ThemeChart theme={theme!} asset={currentAsset!} />
          {themeQAs.length ? (
            <div className="rounded-md bg-base-200 p-4">
              <h2 className="mb-4 text-2xl">Questions</h2>
              <ol className="mt-4 list-none pl-2">
                {themeQAs.map((qa, index) => (
                  <li className="mt-2 mb-4 cursor-pointer" key={index}>
                    <details>
                      <summary>{qa.question}</summary>
                      <p className="mt-2 bg-base-100 p-4 italic">{qa.answer}</p>
                    </details>
                    {index + 1 < themeQAs.length ? (
                      <div className="divider"></div>
                    ) : null}
                  </li>
                ))}
              </ol>
            </div>
          ) : null}
        </div>
      </div>
    </>
  )
}

export default Theme