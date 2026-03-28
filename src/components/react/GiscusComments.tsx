import { useState } from 'react'

interface GiscusConfig {
  repo: string
  repositoryId: string
  category: string
  categoryId: string
  mapping: string
  reactions: string
  metadata: string
  theme: string
  lang: string
}

interface Props {
  slug: string
  config: GiscusConfig
}

const GiscusComments = ({ slug, config }: Props) => {
  const [loaded, setLoaded] = useState(false)

  if (!loaded) {
    return (
      <div className="pt-6 pb-6 text-center text-gray-700 dark:text-gray-300" id="comment">
        <button onClick={() => setLoaded(true)}>Load Comments</button>
      </div>
    )
  }

  return (
    <div className="pt-6 pb-6 text-center text-gray-700 dark:text-gray-300" id="comment">
      <script
        src="https://giscus.app/client.js"
        data-repo={config.repo}
        data-repo-id={config.repositoryId}
        data-category={config.category}
        data-category-id={config.categoryId}
        data-mapping={config.mapping}
        data-reactions-enabled={config.reactions}
        data-emit-metadata={config.metadata}
        data-theme={config.theme}
        data-lang={config.lang}
        crossOrigin="anonymous"
        async
      />
    </div>
  )
}

export default GiscusComments
