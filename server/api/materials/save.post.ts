export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const alias = config.public.apiAlias || 'groshev'
  const targetUrl = `https://naukatv.ru/api/test/materials/${alias}/save`

  const body = await readBody(event)

  if (!body.title || typeof body.title !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Поле title обязательно'
    })
  }

  if (body.title.length > 80) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Длина поля title не должна превышать 80 символов'
    })
  }

  if (body.short_description && body.short_description.length > 255) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Длина поля short_description не должна превышать 255 символов'
    })
  }

  try {
    const response = await $fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body
    })

    return response
  } catch (error: any) {
    throw createError({
      statusCode: error?.response?.status || 500,
      statusMessage: error?.data?.message || error?.message || 'Ошибка при сохранении материала на сервере'
    })
  }
})
