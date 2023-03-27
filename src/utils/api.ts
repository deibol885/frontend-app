async function callAPI(endpoint: string) {
  console.log('endpoint: ', endpoint)
  try {
    const response = await fetch(endpoint, {
      headers: {
        authorization: import.meta.env.VITE_API_KEY,
      },
    })

    const data = await response.json()
    return data
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.log('There was a SyntaxError', error)
    } else {
      console.log('There was an error', error)
    }
  }
}

export async function chat(message: string) {
  const APIUrl = `${
    import.meta.env.VITE_CHATBOT_API_BASEPATH
  }/chatbot?question=${message}&top-k=1`

  const data = await callAPI(APIUrl)
  console.log('data: ', data)

  return data
}

export async function getDocuments(pageId: number, minutes: number) {
  const APIUrl = `${
    import.meta.env.VITE_DOC_API_BASEPATH
  }/doc-url?page_id=${pageId}&minutes=${minutes}`
  const data = await callAPI(APIUrl)

  return data
}
