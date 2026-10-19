export interface Material {
  id: string | number
  title: string
  short_description?: string
  datetime: string
  description_html?: string
  description_json?: any
}

export interface CreateMaterialPayload {
  title: string
  short_description: string
  datetime: string
  description_html: string
  description_json: any
}
