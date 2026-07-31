import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ShopCard from './ShopCard'

const fullShop = {
  id: 1,
  name: 'Herbal Roots Market',
  address: '123 Main St',
  city: 'Portland',
  country: 'USA',
  phone: '+1-555-0100',
  email: 'contact@herbalroots.example',
  distance_km: 3.2,
  has_online_ordering: true,
  has_delivery: true,
  offers_consultation: true,
  rating: 4.2,
  review_count: 5,
}

describe('ShopCard', () => {
  it('renders name, address, and city/country', () => {
    render(<ShopCard shop={fullShop} showDistance={false} />)

    expect(screen.getByText('Herbal Roots Market')).toBeInTheDocument()
    expect(screen.getByText(/123 Main St/)).toBeInTheDocument()
    expect(screen.getByText('Portland, USA')).toBeInTheDocument()
  })

  it('shows distance when showDistance is true and distance_km present', () => {
    render(<ShopCard shop={fullShop} showDistance={true} />)
    expect(screen.getByText(/3.2 км/)).toBeInTheDocument()
  })

  it('hides distance when showDistance is false', () => {
    render(<ShopCard shop={fullShop} showDistance={false} />)
    expect(screen.queryByText(/км/)).not.toBeInTheDocument()
  })

  it('hides distance when showDistance is true but distance_km is missing', () => {
    const { distance_km, ...shopWithoutDistance } = fullShop
    render(<ShopCard shop={shopWithoutDistance} showDistance={true} />)
    expect(screen.queryByText(/км/)).not.toBeInTheDocument()
  })

  it('renders phone and email when present', () => {
    render(<ShopCard shop={fullShop} showDistance={false} />)
    expect(screen.getByText(/\+1-555-0100/)).toBeInTheDocument()
    expect(screen.getByText(/contact@herbalroots.example/)).toBeInTheDocument()
  })

  it('omits phone and email when absent', () => {
    const shop = { ...fullShop, phone: null, email: null }
    render(<ShopCard shop={shop} showDistance={false} />)
    expect(screen.queryByText(/📞/)).not.toBeInTheDocument()
    expect(screen.queryByText(/✉️/)).not.toBeInTheDocument()
  })

  it('renders all feature badges when enabled', () => {
    render(<ShopCard shop={fullShop} showDistance={false} />)
    expect(screen.getByText(/Online/)).toBeInTheDocument()
    expect(screen.getByText(/Доставка/)).toBeInTheDocument()
    expect(screen.getByText(/Консультация/)).toBeInTheDocument()
  })

  it('omits feature badges when disabled', () => {
    const shop = {
      ...fullShop,
      has_online_ordering: false,
      has_delivery: false,
      offers_consultation: false,
    }
    render(<ShopCard shop={shop} showDistance={false} />)
    expect(screen.queryByText(/Online/)).not.toBeInTheDocument()
    expect(screen.queryByText(/Доставка/)).not.toBeInTheDocument()
    expect(screen.queryByText(/Консультация/)).not.toBeInTheDocument()
  })

  it('renders rating and review count when rating present', () => {
    render(<ShopCard shop={fullShop} showDistance={false} />)
    expect(screen.getByText(/4.2/)).toBeInTheDocument()
    expect(screen.getByText('(5)')).toBeInTheDocument()
  })

  it('omits rating block when rating is falsy', () => {
    const shop = { ...fullShop, rating: 0 }
    render(<ShopCard shop={shop} showDistance={false} />)
    expect(screen.queryByText('(5)')).not.toBeInTheDocument()
  })
})
