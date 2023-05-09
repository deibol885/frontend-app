import { selector } from 'recoil'
import { getCompanies } from '../../utils/api'
import { Company } from '../../pages/companies/types'

export const companiesState = selector({
  key: 'companies',
  get: async () => {
    const response = await getCompanies()

    if (!response.data) {
      return []
    }

    return response.data.map((category: any) => ({
      id: category[0],
      name: category[1],
    })) as Company[]
  },
})
