import { useParams } from 'react-router-dom'
import OfferDetail from '../components/OfferDetail'
import { findService } from '../data/agency'

export default function ServiceDetail() {
  const { slug } = useParams()
  return (
    <OfferDetail
      item={findService(slug)}
      parentTo="/services"
      parentLabel="Our services"
    />
  )
}
