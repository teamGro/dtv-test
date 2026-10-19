export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const alias = config.public.apiAlias || 'groshev'
  const targetUrl = `https://naukatv.ru/api/test/materials/${alias}`

  try {
    const data = await $fetch<any[]>(targetUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    })

    return Array.isArray(data) ? data : []
  } catch (error: any) {
    throw createError({
      statusCode: error?.response?.status || 500,
      statusMessage: error?.message || 'Failed to fetch materials from API'
    })
  }
})
