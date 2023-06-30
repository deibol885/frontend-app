import { useCurrentAsset } from '../../pages/assets/hooks'
import { useCurrentTheme } from '../../pages/assets/themes/hooks'
import { useRecoilValue } from 'recoil'
import { qaState } from '../themes-toggles/atoms'
import { formatReferences } from '../../utils/helpers'
import { useDocumentModal } from '../document-modal/hooks'
import Icon from '../icon'

function ThemeQA() {
  const currentAsset = useCurrentAsset()
  const theme = useCurrentTheme()
  const QAs = useRecoilValue(qaState)

  const themeQAs = QAs.filter(
    (qa) => qa.assetId === currentAsset!.id && qa.themeId === theme!.id,
  ).sort((a, b) => {
    if (
      a.answer ===
      'No information for this question exists within the documentation for this asset.'
    )
      return 1

    return -1
  })

  const { onClickDocument } = useDocumentModal()

  if (!themeQAs.length) return null

  return (
    <div className="rounded-md bg-base-200 p-4">
      <h2 className="mb-4 text-2xl">Questions</h2>
      <ol className="mt-4 list-none pl-2">
        {themeQAs.map((qa, index) => {
          const references = formatReferences(qa.references)

          return (
            <li className="mt-2 mb-4 cursor-pointer" key={index}>
              <details open={index === 0}>
                <summary>{qa.question}</summary>
                <div className="mt-2 bg-base-100 p-4 ">
                  <p className="italic">{qa.answer}</p>
                  {references.length ? (
                    <>
                      <div className="divider"></div>
                      <p className="mt-4 font-bold">References</p>
                      <ol>
                        {references.map((link, index) => (
                          <li
                            className="cursor-pointer"
                            onClick={() => onClickDocument(link)}
                            key={index}
                          >
                            <Icon icon="file-pdf" size={10} />
                            <span className="ml-2 italic text-secondary hover:underline">
                              {link.name}, page {link.page}
                            </span>
                          </li>
                        ))}
                      </ol>
                    </>
                  ) : null}
                </div>
              </details>
              {index + 1 < themeQAs.length ? (
                <div className="divider"></div>
              ) : null}
            </li>
          )
        })}
      </ol>
    </div>
  )
}

export default ThemeQA