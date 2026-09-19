import { useParams } from 'react-router-dom'
import OfferDetail from '../components/OfferDetail'
import { findSolution } from '../data/agency'

export default function SolutionDetail() {
  const { slug } = useParams()
  return (
    <OfferDetail
      item={findSolution(slug)}
      parentTo="/solutions"
      parentLabel="Solutions"
    />
  )
}
