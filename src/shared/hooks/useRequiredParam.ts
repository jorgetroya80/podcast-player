import { useParams } from 'react-router'

import { requireParam } from '../utils/requireParam'

export const useRequiredParam = (name: string): string => requireParam(useParams()[name], name)
